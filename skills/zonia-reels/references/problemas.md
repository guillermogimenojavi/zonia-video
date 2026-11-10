# Problemas frecuentes

## Instalación

- **`entorno` dice que falta ffmpeg o Node justo después de instalarlo (Windows).** El PATH no se actualiza hasta abrir una terminal nueva. El script ya prueba las rutas típicas: `%LOCALAPPDATA%\Microsoft\WinGet\Links` y `C:\Program Files\nodejs`. Si sigue fallando, pide al usuario que reinicie Claude o la terminal.
- **No está winget, o en macOS no está Homebrew.** Indica al usuario la instalación manual: ffmpeg desde gyan.dev (Windows) o `brew`, y Node LTS desde nodejs.org. Luego repite `entorno`.
- **`pip install faster-whisper` falla.** Comprueba la versión de Python con `python --version`: hace falta la 3.9 o superior, y mejor 3.10–3.13 de 64 bits.
- **No se puede instalar PyTorch (torch y torchaudio), o `alinear` dice que falta.** El modo pro funciona igual: `alinear` reparte los tiempos de Whisper sobre el texto del guion y avisa de que son aproximados (±0,1–0,3 s). Las animaciones no caerán siempre en la sílaba: revisa más fotogramas en las entradas importantes y díselo al usuario. La primera alineación exacta descarga un modelo de 1,2 GB.
- **Tildes y símbolos rotos, o `UnicodeEncodeError`, al ejecutar un script suelto en Windows.** Lánzalo a través de `reel.py` (pone UTF-8) o con `PYTHONIOENCODING=utf-8`.

## Transcripción (Whisper)

- **La primera vez tarda:** descarga el modelo, unos 3 GB para large-v3 o 1,5 GB para medium. Avisa al usuario.
- **Errores de `cudnn` o `cublas`, o "no GPU".** El script sigue en la CPU (más lento, pero funciona). Para la GPU NVIDIA en Windows, usa `entorno --instalar --gpu`, que instala nvidia-cublas-cu12 y nvidia-cudnn-cu12. Si el usuario tiene PyTorch con CUDA, ya vale.
- **`TypeError: open() got an unexpected keyword argument 'metadata_errors'`.** PyAV 19 rompe faster-whisper 1.2. Instala `av==15.1.0` con el archivo de restricciones que fija torch (ver `CLAUDE.md` de la carpeta de trabajo). (3-11-2026)
- **`RuntimeError: mkl_malloc: failed to allocate memory` en la CPU, aunque haya memoria libre.** Pasaba al intentar antes la GPU en un equipo sin NVIDIA. `transcribir.py` ya se salta la GPU si `ctranslate2` no ve ninguna. (3-11-2026)
- **Nombres mal escritos.** Pasa `--nombres "Claude, n8n, ..."` en `analizar` y corrige lo que quede con `correcciones` en el guion.
- **Muletillas sin transcribir ("eh", "mmm").** Whisper no las escribe. Las zonas de voz sin palabras suelen ser eso; déjalas fuera de los tramos.

## Cortes y vídeo base

- **`edl` avisa «sonido desconocido» en todos los efectos y el reel sale sin ellos.** Faltaba la carpeta `sonidos/` de la skill (28 efectos del modo pro con su `sonidos.json`): no se copió al adaptar `editor-reels`. Restaurada el 3-11-2026; ahora `preparar` se para si falta la biblioteca o alguno de sus archivos.
- **`Unrecognized option 'filter_complex_script'` al montar el vídeo base.** ffmpeg 7 la cambió por `-/filter_complex <archivo>` y el 9 ya no acepta la antigua. `montar_base.py` elige la buena según la versión. Solo intenta NVENC si `nvidia-smi` ve una tarjeta: ffmpeg trae el codificador aunque no la haya. (3-11-2026)
- **Se come el principio o el final de una palabra.** Amplía ese tramo 0,1 s en `--tramos`. `cortes.py` busca la voz clara (27 dB sobre el suelo de ruido) para no meter respiraciones. Con un audio muy ruidoso, puede hacer falta un umbral más bajo.
- **No detecta la cara.** `encuadre.py` falla y se usa un recorte centrado. Si la persona no está en el centro, monta a mano con `montar_base.py ... --centro-x <px> --ancho <px>`.
- **Vídeo vertical de móvil.** Funciona: si hace falta reducir, los lados se rellenan con desenfoque. Pon `"relleno": "desenfoque"` si el fondo no es liso.
- **Vídeos de iPhone (HEVC, frecuencia variable).** ffmpeg los lee sin problema. El vídeo base sale en H.264 a fotogramas constantes.
- **El movimiento da tirones (fotogramas repetidos).** Muchas cámaras, capturadoras y OBS guardan «a 60 fps» (o a 30) una imagen que en realidad va a 25 o a 24: el archivo repite fotogramas. Montado a 30, uno de cada seis sale repetido. `analizar` y `cortar` miden los fotogramas reales (`scripts/cadencia.py`, en ventanas con voz), montan el reel a esa cifra y quitan los repetidos antes de cortar. Lo dicen al ejecutarse («el archivo dice 60, la imagen va a 25»). Si `cortar` avisa de que el vídeo base sigue repitiendo fotogramas, repite con el `--fps` que indica. Un simple `fps=25` de ffmpeg no lo arregla (elige mal los fotogramas): hay que quitar el repetido de cada ciclo, que es lo que hace `montar_base.py --mitad --ciclo N`.
- **El reel empieza con un parpadeo o con la boca a medias.** Es el fotograma que se ve antes de reproducir. `cortar --congelar-inicio N` sustituye los N primeros fotogramas por el siguiente (queda quieto unas centésimas, sin desfasar la voz).
- **He vuelto a cortar y el guion ya estaba escrito.** `cortar` guarda los cortes anteriores (`cortes_guion.json`) y avisa. `reel.py recolocar <reel>` lleva cada tiempo del guion al mismo instante del vídeo nuevo (deja copia `.antes.json`); después, `alinear` y `edl`, y repasa la tabla de sincronía.
- **El vídeo base pesa mucho o el render va lento.** `montar_base.py` reduce el recorte a 1296 px de ancho (lo que hace falta para un zoom de 1,2); con una grabación 4K el render tarda la mitad. `--ancho-max 0` lo desactiva.
- **Clips de móvil unidos que salen girados o con el tamaño cambiado (1920x1080 en vez de 1080x1920).** ffmpeg 7 copia al archivo unido la marca de rotación del primer clip aunque la imagen ya esté girada. Quítala sin recodificar: `ffmpeg -display_rotation 0 -i unido.mp4 -c copy bien.mp4`. Compruébalo con `ffprobe -show_entries stream_side_data` (no debe salir `rotation`).
- **Selfie en espejo (el texto de la camiseta se lee al revés).** El iPhone graba así con "Reflejar cámara frontal". Voltea esos clips con `hflip` al unirlos.
- **Un clip enseña un vídeo que suena en el ordenador y no se oye.** El micro inalámbrico no coge los altavoces. Busca el vídeo original y sincronízalo por los cambios de imagen: correlación de la variación de brillo por fotograma entre la zona de la pantalla y el original (la del audio no sirve si apenas se oye). Pon su audio en ese tramo y, si el clip corta a mitad de frase, déjalo sonar sobre el principio del plano siguiente (corte en L).
- **NVENC no disponible o falla.** `montar_base.py` usa libx264 solo (más lento).

## Remotion

- **`Failed to launch the browser process ... chrome-headless-shell.exe ENOENT` (Windows).** Casi siempre es una ruta de más de 260 caracteres: la carpeta del proyecto está demasiado anidada. `preparar` avisa si pasa de unos 110 caracteres. Mueve el proyecto a una ruta corta y vuelve a ejecutar `preparar`. Por eso los reels van en `C:\zonia\reels` (o `~/zonia/reels` en Mac) y no en una carpeta del escritorio.
- **`preparar` ya descarga Chrome Headless Shell** (unos 110 MB, con `npx remotion browser ensure`) y `revisar` se asegura de que esté. Es normal que la primera vez tarde.
- **Las tipografías (Nunito, Geist y Geist Mono) van en local** (`editor/public/fonts`, la copia `preparar`): el render no necesita internet. Si sale otra letra, comprueba que existe esa carpeta y vuelve a ejecutar `preparar`.
- **`delayRender` agota el tiempo o sale una imagen en negro en `revisar`.** Vuelve a lanzarlo. Si se repite, comprueba que `editor/public/reels/<reel>/base.mp4` existe y que el EDL apunta a él.
- **Render lento.** Cuenta con 2–4 minutos por minuto de vídeo. La concurrencia está en `editor/remotion.config.ts` (`setConcurrency`).
- **Cambios de la plantilla que no se ven.** Ejecuta `reel.py preparar`, que copia `plantilla/` en `editor/`. No toca `editor/src/pro/propias.tsx` (las piezas propias del proyecto).
- **El disco se llena, o `ENOSPC: no space left on device`.** Remotion deja en la carpeta temporal del sistema una copia del proyecto por ejecución (`remotion-webpack-bundle-…`) y otra del vídeo base por cada fotograma suelto (`remotion-v…-assets…`), y en Windows no siempre las borra: llegaron a acumularse 80 GB. `revisar`, `portada` y `render` trabajan en una carpeta temporal propia (`editor-reels-…`) y la borran al acabar. Si lanzas Remotion a mano (`npx remotion …`), borra después esas carpetas de la carpeta temporal. Ante un fallo raro al renderizar, mira primero el espacio libre.
  Además, Remotion copia la carpeta `public` entera en cada ejecución: con tres reels a la vez (su `base.mp4` y su
  `ancho.mp4`) eran 1,5 GB más por cada `revisar` o `render`, y `revisar` acabó en `ENOSPC … remotion-stitch-temp-dir`
  (3-11-2026). Desde entonces `revisar`, `portada` y `render` le pasan una carpeta `public` con solo los vídeos de ese
  reel, hecha con enlaces duros (`publico_ligero` en `reel.py`; `fotogramas.mjs --public`, `--public-dir` en el render).
- **Un aviso rojo «Pieza desconocida» en los fotogramas.** El `tipo` de una pieza del guion no existe: está mal escrito o falta apuntarla en `propias.tsx`.
- **Los colores del vídeo cambian según el reproductor (más contraste, tonos raros).** El render va con `--color-space=bt709` para que salga marcado como vídeo estándar; si renderizas a mano, no lo quites.
- **Un error de TypeScript en una pieza propia.** Compruébalo con `npx tsc --noEmit -p .` dentro de `editor/`.
- **`reel.py captura` no saca la página** (pide sesión o bloquea navegadores automáticos). Haz la captura a mano, guárdala en `editor/public/reels/<reel>/media/` y pon su ancho y su alto en el guion.
- **La captura sale tapada por un aviso de cookies o una barra de idioma.** Si es una banda arriba o abajo, `--ocultar fijos` la quita (y `--quitar-arriba` / `--quitar-abajo` recortan lo que quede). Si es una ventana que tapa toda la página, `--clic "Decline optional cookies"` pulsa antes el botón con ese texto: siempre el de rechazar las cookies opcionales, nunca el de aceptar. Si ni así se va (pasa en ai.meta.com), captura otra página oficial: la nota de prensa suele servir mejor que la página del producto. Con más de 1000 px de `--ancho`, muchas webs pasan a su versión de escritorio con barra lateral: mejor 900.

## Doble pantalla

- **`edl` avisa de que falta el vídeo ancho, o la mitad de abajo sale en negro.** La pieza `doble` usa `editor/public/reels/<reel>/ancho.mp4`, que monta `reel.py edl` (no `edl_pro.py` suelto). Vuelve a ejecutar `reel.py edl <reel>`.
- **He vuelto a cortar.** `reel.py edl` rehace el vídeo ancho solo: compara su fecha con la de `base.mp4`. Para forzarlo, borra `ancho.mp4`.
- **La cabeza queda cortada por la costura, o la persona sale pequeña.** Las dos escalas que usa (cerca y abierto) están en `trabajo/<reel>/ancho.json`. Para cambiarlas en una pieza, escribe sus encuadres a mano: `"planos": [[9.48, 0.44], [13.92, 0.41]]` (desde, escala). Con una escala menor de la que cubre el ancho, se ven los bordes.
- **«La grabación es estrecha y la cabeza no cabe».** La mitad de abajo es apaisada: hace falta una grabación horizontal con aire a los lados de la persona. Con un vídeo vertical no hay doble pantalla; dilo y usa cara con pieza o una escena.
- **El render va más lento en esos tramos.** Lee dos vídeos a la vez; es normal.
- **Un cuerpo propio (de escena o de doble pantalla) sale mudo aunque lleve `"sonidos"`.** Hasta el 3-11-2026,
  `edl_pro.py` solo leía los `sonidos` de la pieza y se saltaba los de sus cuerpos (le pasó al `documento` del vertical de
  Método). Ahora se suman a los de la pieza: comprueba en la línea final de `edl` («N sonidos») que el número sube.
- **Un aviso rojo «Cuerpo desconocido» arriba.** El `tipo` de un cuerpo no existe: está mal escrito o falta apuntarlo en `DOBLES` (`propias.tsx`). Un `propias.tsx` anterior a la doble pantalla no tiene `DOBLES`: añádelo.

## Logos

- **`NOT FOUND` o "calidad baja".** Busca el logo oficial (kit de prensa o la web del producto) y compruébalo sobre los dos fondos (noche y marfil). Para herramientas recientes que no están en los catálogos, añádelas al mapa `TOOLS` de `scripts/logos.py` con `"web": "https://..."`. Así se hizo con Google Stitch y Google Flow.
- **Logo que no se ve sobre el fondo.** `logos.py` guarda dos versiones: la del tema oscuro pasa a texto de noche lo que no contrasta, y la del claro (`<slug>-claro.svg`), a tinta. Si un logo llega de otra fuente, prepara tú las dos y apúntalas en `logos.json` (`file` y `file_claro`).
- **Un logo invisible en un reel claro.** El registro es anterior a la versión clara: vuelve a pedirlo con `reel.py logos "Nombre" --force`.

## Instagram

- **No se puede descargar un reel por enlace** (yt-dlp dice "login required"). No uses las cookies del usuario. Pídele el botón "Descargar" de la app o una grabación de pantalla, o analízalo en el navegador (ver `referencias.md`).

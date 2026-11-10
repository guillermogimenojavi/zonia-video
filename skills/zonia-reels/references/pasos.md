# Reels de zonia: los pasos en detalle

El detalle de cada paso (antes estaba en `SKILL.md`). Las rutas son desde la carpeta de la skill.
**Lee solo el apartado del paso en el que estás.**

## Índice

- 0. Preparar el equipo y el proyecto
- 1. Analizar el vídeo
- 2. Cortar y montar el vídeo base
- 3. Tiempos exactos de cada palabra
- 4. El plan del reel: qué se ve en cada frase
- 5. Datos, logos y material real
- 6. Escribir el guion
- 7. Revisar antes de renderizar
- 8. Renderizar, comprobar y entregar
- Doble pantalla
- Modo clásico
- Iterar con el feedback

## 0. Preparar el equipo y el proyecto

1. **Comprueba las herramientas:** `python <skill>/scripts/reel.py entorno`
   - Si falta algo, dile al usuario qué vas a instalar y para qué («ffmpeg para cortar vídeo, Node.js para las animaciones y PyTorch para que cada animación entre con tu voz; unos cientos de MB»).
   - Después: `python <skill>/scripts/reel.py entorno --instalar`. Añade `--gpu` si tiene una tarjeta NVIDIA y no están las librerías CUDA.
   - En Windows, lo recién instalado a veces no aparece hasta reabrir la terminal. El script ya prueba las rutas habituales.
2. **Prepara el proyecto:** `python <skill>/scripts/reel.py preparar`, desde la carpeta de los reels: **`<carpeta de trabajo>/reels`** (créala si no existe). Tiene que ser una ruta corta (`C:\zonia\reels` en Windows, `~/zonia/reels` en Mac): con más de unos 110 caracteres el navegador de Remotion no arranca en Windows. Crea `brutos/` (donde se dejan los vídeos en bruto), `trabajo/` (lo intermedio), `salida/` (reels terminados), `editor/` (el proyecto de Remotion, con sus dependencias, los sonidos, las letras y los logos de zonia) y `marca.json`. Vuelve a ejecutarlo si actualizas la skill o cambias `marca.json`.
3. **Marca:** zonia, ya puesta en `marca.json` y obligatoria: tema claro por defecto (fondo marfil `#FBF4E7`, texto tinta `#3A2A21`) o noche (fondo `#1F1A17`, texto `#F6EBDD`), con el coral teja `#DF663F` como único acento, Nunito y Geist, y el logo de zonia arriba a la derecha. **Cada reel elige su tema** con `"tema": "claro"` u `"oscuro"` en el guion; si no lo dice, usa el de su `perfil.md` o pregúntalo al presentar el plan. El **estilo de animación** es el que eligió al empezar (`zonia-video`). Ver `references/estilo.md`.

## 1. Analizar el vídeo

```
python <skill>/scripts/reel.py analizar brutos/<video>.mp4 <reel> --nombres "Herramientas o nombres que salen"
```

`<reel>` es un nombre corto y sin espacios, por ejemplo `gemini4-argon`. El comando:
- transcribe con marcas de tiempo por palabra (en la GPU si la hay); `--nombres` ayuda a escribir bien las marcas;
- detecta la cara para el encuadre;
- mide los **fotogramas reales** de la grabación (muchas cámaras guardan «a 60» una imagen que va a 25: si no se tiene en cuenta, el movimiento da tirones);
- imprime la transcripción con las pausas, las zonas de voz y una **propuesta de tramos** que ya excluye los silencios.

Ahora decides tú, como editor, qué se queda. Parte de la propuesta de tramos y:
- **Quita las tomas repetidas.** Suele valer la última toma completa y fluida. Mira también qué queda mejor encadenado con lo anterior.
- **Quita** frases a medias, trabas y arranques en falso.
- **Desconfía de Whisper en dos casos:**
  - Adelanta la primera palabra de cada frase, que se come el silencio anterior. Los bordes buenos son los de las zonas de voz.
  - A veces duplica palabras («visual. Visual.») donde no hay voz. Si una palabra no cae dentro de ninguna zona de voz, no existe.
- Si vas a quitar algo que cambia el contenido (una frase entera, no una traba), díselo al usuario en una línea.

**Varios vídeos de la misma grabación:** únelos antes en uno (`brutos/<reel>.mp4`), en orden, con ffmpeg a fotogramas constantes, y analiza ese.

## 2. Cortar y montar el vídeo base

```
python <skill>/scripts/reel.py cortar <reel> --tramos "1.71-5.62,9.26-13.04,..."
```

- Afina cada corte con el volumen del audio, para no comerse sílabas ni meter respiraciones, y deja solo una décima de segundo entre frases: un reel no lleva pausas.
- Une los tramos, reencuadra a vertical según la cara y monta el reel a los fotogramas reales, sin repetidos.
- Normaliza la voz a −14 LUFS y vuelve a transcribir el vídeo limpio.
- Crea `trabajo/<reel>/alineacion/guion.txt` (el texto, una frase por línea) y un guion vacío.

Detalles:
- **Ritmo:** al acabar, `cortar` lista las pausas que quedan dentro de los tramos («··· pausa 0.4s»). Quita las de medio segundo o más, y también las de tres décimas si van a quedar tapadas por una escena (el corte no se ve). No añadas respiros «para que se lea»: si una palabra necesita más tiempo en pantalla, la pieza se queda sobre el plano siguiente. Cómo, en `references/oficio.md` (apartado 7).
- **Una respiración o una pausa dentro de una frase:** parte el tramo y marca con `=` los bordes que no se deben ajustar (`78.16-=83.74,=84.04-87.67`). Cada corte abre página de subtítulos: hazlo donde pueda cambiar.
- **Primer fotograma:** es lo que se ve antes de darle a reproducir. Mira los primeros (`cortar` imprime el comando: `reel.py tira editor/public/reels/<reel>/base.mp4 0 0.32 --fps <los del reel> --ancho 400`) y, si el reel abre con los ojos a medio cerrar, repite `cortar` con `--congelar-inicio 2` (o los que hagan falta): esos fotogramas se sustituyen por el primero bueno.
- **Si vuelves a cortar con el guion ya escrito,** `cortar` te lo avisa: `reel.py recolocar <reel>` mueve todos los tiempos del guion al vídeo nuevo.

## 3. Tiempos exactos de cada palabra

1. **Repasa `trabajo/<reel>/alineacion/guion.txt`:** una frase por línea, escrita tal como se verá en pantalla (nombres bien escritos, cifras en número, tildes, signos). Si algo se pronuncia distinto de como se escribe, pon la pronunciación entre llaves pegada a la palabra: `GPT-6{ge pe te seis}`, `OpenAI{open ei ai}`, `Claude{clod}`. Ejemplo: `ejemplos/guion_alinear_ejemplo.txt`.
2. **`python <skill>/scripts/reel.py alinear <reel>`**

Imprime cada palabra con su número y su inicio y fin exactos. **Estos son los tiempos del guion** (Whisper va 0,2–0,45 s adelantado y no sirve para sincronizar). Las palabras con «?» tienen puntuación baja: es normal en cifras y nombres en inglés; si le pasa a una palabra corriente, al texto le falta o le sobra algo.

## 4. El plan del reel: qué se ve en cada frase

Antes del guion, escribe el plan en `trabajo/<reel>/README.md`: una fila por frase con el plano (cara + pieza, escena, primer plano o doble pantalla), la pieza y **qué entra en qué palabra**. Cómo se decide, en `references/oficio.md` (apartados 3 y 4); qué pieza encaja con cada tema de zonia, en `references/marca.md` (apartado 4). **Enseña el plan con los textos que saldrán en pantalla antes de escribir el guion**, y marca lo que necesite su revisión (una cifra, una frase delicada). Lo imprescindible:

- **El fotograma 0 ya tiene el gancho entero** y el primer cambio de plano llega antes del segundo 3.
- **Una frase, una idea, una pieza.** Y un cambio visual cada 1–2 s: algo que entra, algo que se enciende o un corte.
- **La pieza explica; el subtítulo ya repite.** Mejor el mecanismo, la proporción o la prueba que las mismas palabras con otra letra.
- **Una escena a pantalla completa cada 10–15 s,** con la pregunta que se hace el espectador como titular.
- **Un primer plano sin pieza** para las frases que van directas al espectador.
- **Doble pantalla,** si el usuario la pide o si una explicación larga tiene una estructura que se va construyendo (ver el apartado «Doble pantalla»).
- **Un cierre con su propia pieza:** la pregunta, el comentario, las acciones.
- **Algo pensado para este tema.** Si ninguna pieza del catálogo cuenta bien una idea, diseña una (`references/guion-pro.md`, apartado 9). En zonia suele ser el mapa de la zona, una comparación de dos zonas o los cubos del logo.
- **Textos de marca:** tipo oración en titulares y frases, mayúsculas solo en etiquetas, y todo pasa la lista de `references/marca.md` (apartado 3): ninguna cifra sin fuente oficial, nada de alarmismo ni de señalar barrios.

## 5. Datos, logos y material real

- **Verifica todo dato en la fuente oficial** (WebSearch y WebFetch), también los que dice la voz: la marca no admite ninguna cifra sin fuente primaria. Si es una comparación, en dos fuentes más. Apúntalos con su fuente en el `README.md` del reel. **No te inventes datos, fechas ni un orden que la fuente no da.**
- **Logos:** `python <skill>/scripts/reel.py logos "Claude" "n8n" "Google Stitch"`.
  - Busca en Lobe Icons, SVGL, Simple Icons, el icono oficial de la web y, por último, el favicon. Guarda dos versiones de cada uno, una para el tema oscuro y otra para el claro, apuntadas en `editor/public/logos/logos.json`; `edl` elige la que toca.
  - En los reels de zonia casi nunca hacen falta: solo si la voz nombra una herramienta, una fuente o una organización.
  - Si sale `NOT FOUND` o «calidad baja», busca el logo oficial (kit de prensa o la web del producto), guárdalo en `editor/public/logos/` y apúntalo igual, o añade la herramienta al mapa `TOOLS` de `<skill>/scripts/logos.py`.
  - Nunca uses un logo que no se vea bien sobre el fondo del tema del reel.
- **La página de la fuente** (para un `revelado` o una `ventana`): `python <skill>/scripts/reel.py captura <reel> <url>`. Mírala antes de usarla. Si la tapa un aviso de cookies: `--ocultar fijos` quita las bandas pegadas arriba y abajo, `--quitar-arriba` / `--quitar-abajo` recortan, y `--clic "texto del botón"` pulsa antes el de rechazar las cookies opcionales (ver `references/problemas.md`).

## 6. Escribir el guion

Rellena `trabajo/<reel>/guion_pro.json` siguiendo el plan. Formato, catálogo de piezas y un ejemplo de cada una: `references/guion-pro.md`. Guiones reales completos: `ejemplos/guion_pro_ejemplo.json` (una noticia, solo con piezas del catálogo), `ejemplos/guion_pro_muse.json` (una herramienta, con seis piezas propias: `ejemplos/propias_muse.tsx`) y `ejemplos/guion_pro_haiku55.json` (un modelo nuevo, con dos tramos de doble pantalla: `ejemplos/propias_haiku55.tsx`).

- **Cada cosa lleva su `en`:** el inicio de la palabra que la nombra, según la tabla de `alinear`.
- **Los sonidos, la paginación de subtítulos y el logo de la marca se ponen solos.** Tú decides las piezas, los encuadres, los capítulos y los acentos.
- **Encuadres:** uno por tramo; solo cambian en los cortes. Con pieza, el zoom se ancla en la barbilla (la cara nunca baja hacia la pieza); el primer plano sin pieza, en la cara.

Después:

```
python <skill>/scripts/reel.py edl <reel>
```

Imprime tres cosas que hay que leer enteras:
- **Los subtítulos,** página a página. Arregla con `partir_antes` las que corten mal una idea y con `textos` los signos y las palabras comidas.
- **La tabla de sincronía:** cada cosa que entra, la palabra que suena en ese instante y cuánto falta. Lo que nombra una palabra debe caer en ella (±0,05 s); un «¿suelto?» es un tiempo que no cae en ninguna.
- **Los avisos:** piezas que se pisan, cosas que se ven menos de un segundo, logos que faltan, golpes graves seguidos. Corrige o decide a conciencia.

## 7. Revisar antes de renderizar

```
python <skill>/scripts/reel.py revisar <reel> auto --zonas
python <skill>/scripts/reel.py sonido <reel>
```

`revisar auto` saca un fotograma de cada momento que importa (cada pieza entrando, cada cosa recién encendida, cada pieza completa) en hojas de cuatro (`trabajo/<reel>/revision/`). `--zonas` pinta en rojo lo que tapa la interfaz de Instagram. Mira todas las hojas:

- la cara nunca tapada, y con hueco entre la barbilla y la pieza también en los planos cercanos;
- nada que haya que leer bajo las zonas rojas;
- todo legible a tamaño de móvil, sin textos cortados ni encimados, con los logos correctos;
- lo que aparece coincide con lo que se dice en ese instante.

`sonido` compara cada efecto con la voz: ninguno debe salir marcado como fuerte.

Corrige el guion y repite `edl` y `revisar` (con segundos sueltos: `revisar <reel> 12.4 18.7`) hasta que todo esté bien. Renderizar tarda 3–5 minutos; revisar fotogramas, segundos.

## 8. Renderizar, comprobar y entregar

```
python <skill>/scripts/reel.py render <reel> --nombre v1 --previa   # vista previa a 720p (borrador)
python <skill>/scripts/reel.py render <reel> --nombre final          # entrega directamente en 2K (1440×2560)
python <skill>/scripts/reel.py portada <reel>
python <skill>/scripts/reel.py tira salida/<reel>_v1.mp4 18.8 20.0 --fps 25
```

- `render` deja `salida/<reel>_v1.mp4` con el sonido masterizado (debe salir en −14 LUFS aproximadamente, con el pico por debajo de −1 dB).
- `portada` deja `salida/<reel>_portada.jpg` (si el guion tiene `portada`).
- `tira` saca fotogramas seguidos del vídeo ya hecho: mira así un par de transiciones.
- **Revisión de retención** (si el reel va a Instagram, TikTok o Shorts): con `salida/<reel>_v1.mp4`, `trabajo/<reel>/alineacion/tiempos.json` como `--transcripcion` y los instantes de la tabla de sincronía de `edl` como `--eventos`, según `zonia-video` (sección «Antes de publicar un vertical»). Con alguna FALLA, no se entrega como final sin su visto bueno.
- **Revisión independiente:** antes de entregar, lanza un subagente que revise el vídeo sin haberlo hecho (qué pedirle, en `references/oficio.md`, apartado 9). Comprueba sus hallazgos antes de cambiar nada.

**Entrega** el archivo (en `salida/`) y cuenta en pocas líneas y sin jerga: cuánto has quitado, qué se ve en cada parte, **qué datos salen en pantalla y de dónde vienen**, y cualquier duda sobre lo que dice (un nombre mal pronunciado, algo que no cuadra con la fuente). Pide opinión con ejemplos de lo que puede pedir: «subtítulos más grandes», «menos cosas en pantalla», «ese logo no es», «más rápido».

**Música:** el reel sale sin música a propósito; se añade en Instagram al publicar, con canciones con licencia y tendencias.

## Doble pantalla

La persona en la mitad de abajo y, en la de arriba, la animación de lo que está explicando. Es la pieza `doble` del modo pro (`references/guion-pro.md`, apartado 4). No la confundas con una «grabación doble» (pantalla y cámara grabadas a la vez), que es del modo clásico.

**Cuándo:** siempre que el usuario la pida («doble pantalla», «pantalla partida», «ponme abajo y las animaciones arriba», «que se me vea mientras sale la animación»). Sin que la pida, como mucho en uno o dos tramos del reel: una explicación larga con una estructura que se va construyendo (una escalera de modelos, una lista de usos, unos pasos).

- **Qué hace falta:** una grabación horizontal, porque la mitad de abajo es apaisada. Con un vídeo vertical la cabeza no cabe: `edl` lo avisa y hay que decírselo al usuario.
- **Qué escribes en el guion:** `{"tipo": "doble", "i": …, "f": …, "cuerpos": […]}`, que empieza y acaba en un corte. Dentro, cuerpos del catálogo (`escalera`, `iconos`) o propios (se apuntan en `DOBLES`, en `propias.tsx`). Opcionales: `titulo` (la pregunta del espectador) y `avance` (un tramo por cada cosa que se va a contar). Los tramos que abarca llevan zoom `[1.0, 1.0]`.
- **Qué hace sola la skill:** `reel.py edl` monta el vídeo de la mitad de abajo (`ancho.mp4`: los mismos cortes con un recorte más ancho), coloca a la persona con la barbilla justo encima de los subtítulos y alterna dos encuadres en los cortes de dentro. Si se vuelve a cortar, lo rehace.
- **Qué no cambia:** los subtítulos, el capítulo y el logo siguen en su sitio; cada cosa entra en su palabra; lo que espera, apagado.
- **Reglas de uso** (cuánto dura, cada cuánto cambia algo arriba): `references/oficio.md`, apartado 2.

Guion real con dos tramos de doble pantalla: `ejemplos/guion_pro_haiku55.json` (su texto, en `ejemplos/guion_alinear_haiku55.txt`, y sus piezas propias, en `ejemplos/propias_haiku55.tsx`).

## Modo clásico

Para lo que el modo pro no cubre:

- **Clips de móvil (selfie y pantalla grabada con el móvil, ya en vertical):** edición sencilla con el plano entero (`"encuadre": "completo"`), subtítulos, título de portada y llamada a comentar. Al unirlos, mira un fotograma de cada clip: voltea los selfies en espejo (`hflip`), iguala el volumen de la voz y quita la marca de giro que ffmpeg 7 copia del primer clip (ver `references/problemas.md`).
- **Grabación doble (pantalla y cámara una al lado de la otra, p. ej. 3840×1080 de OBS):** se detecta sola. `cortar` genera además `pantalla.mp4` con los mismos cortes, para la pieza `pantalla`.

Pasos: `cortar <reel> --tramos "…" --clasico` (crea `guion.json`), logos, escribir el guion con los tiempos que imprime `cortar` (`references/guion.md`, con un guion real en `ejemplos/guion_ejemplo.json`), `edl`, `revisar <reel> 0.5 6.3 …`, `render` y `portada <reel> 1.0`. No hace falta `alinear`. La música, si el usuario pasa una pista: `"musica": {"archivo": "musica/pista.mp3", "volumen": 0.1}`.

## Iterar con el feedback

- **Si el cambio es de este reel** (tiempos, textos, qué pieza va dónde), cambia el guion y renderiza una versión nueva (`--nombre v2`).
- **Si el cambio es de estilo y afecta a todos los reels** (un tamaño, una animación, una pieza nueva que va a repetirse), cámbialo en `<skill>/plantilla/` y ejecuta `preparar`. Díselo al usuario.
- **Si el usuario rechaza algo,** anótalo en `references/estilo.md` con el motivo, para no repetirlo.

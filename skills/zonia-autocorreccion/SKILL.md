---
name: zonia-autocorreccion
description: Arregla de raíz los fallos de las herramientas de edición de vídeo de zonia (skills zonia-reels, zonia-animado y zonia-video, sus scripts, ffmpeg, faster-whisper, PyTorch, Remotion, Playwright, HyperFrames) y deja la skill blindada para que no vuelva a pasar. Úsala SIEMPRE que un comando de esas skills termine con error, traza de Python, «Ha fallado», código de salida distinto de 0, o un resultado que no cuadra (palabras que se cuelan, vídeo sin sonido, archivo que no aparece), y cuando digan «arréglalo», «ha fallado», «otra vez el error» o «que no vuelva a pasar». No es para cambios de estilo o de contenido de un vídeo.
---

# Autocorrección de las skills de vídeo

Cuando algo falla, el trabajo no es sortearlo esta vez: es **arreglar la skill** para que la próxima conversación no
tropiece con lo mismo. Quien edita no tiene por qué ser técnico: dile en una línea qué ha pasado y que está arreglado,
sin jerga.

## Método

1. **Lee el error entero**, no solo la última línea. En PowerShell, los avisos que un script escribe en stderr salen
   como `NativeCommandError` aunque no sean errores: busca la traza de Python (`Traceback`) o la línea de `ffmpeg`.
2. **Clasifícalo** (tabla de abajo). Casi todos los de este equipo son de versiones o del entorno, no del vídeo.
3. **Reprodúcelo en pequeño** antes de tocar nada: el comando que falla, solo, con un archivo corto (`ffmpeg -t 10`).
   Así confirmas la causa y luego compruebas el arreglo en segundos.
4. **Arregla la causa en el script de la skill**, no a mano en el proyecto:
   - Que el arreglo detecte la situación (versión de ffmpeg, si hay GPU, si la ruta es larga) en vez de suponerla.
   - Si el mismo patrón está en otra skill del paquete (`Grep` en la carpeta de skills), arréglalo en todas las copias.
   - Si el fallo es de una librería, que `entorno.py` lo **compruebe de verdad** (usarla con un archivo de prueba, no solo
     mirar si está instalada) y que `--instalar` ponga la versión buena.
   - Nunca actualices torch, torchaudio, numpy ni av por las buenas: instala con restricciones (`entorno.py` las
     escribe).
5. **Comprueba el arreglo** repitiendo el paso que falló con el material real, y revisa su resultado, no solo que
   termine sin error.
6. **Apúntalo** en el mismo turno:
   - `zonia-reels/references/problemas.md` (o la skill que toque): síntoma (el mensaje literal), causa y qué hace
     ahora el script, con la fecha;
   - si depende de ese ordenador (versiones fijadas, rutas), en su `perfil.md` («Quién soy»);
   - el caso nuevo, en la tabla de abajo.
7. **Retoma el trabajo** donde se quedó.

Si el arreglo necesita instalar algo grande, borrar algo o tocar algo fuera de la carpeta de trabajo, pregunta antes.

## Fallos ya vistos (en Windows sin tarjeta NVIDIA)

| Síntoma | Causa | Arreglo en la skill |
|---|---|---|
| `open() got an unexpected keyword argument 'metadata_errors'` al transcribir | PyAV 19 rompe faster-whisper 1.2 | `entorno.py` prueba a leer un audio y `--instalar` pone `av==15.1.0`; las instalaciones fijan `av<19` |
| `mkl_malloc: failed to allocate memory` en la CPU, con memoria libre | intentar antes la GPU sin tarjeta NVIDIA deja la memoria tocada | `transcribir.py` (las dos) se salta la GPU si `ctranslate2` no ve ninguna |
| `Unrecognized option 'filter_complex_script'` | ffmpeg 7 la cambió por `-/filter_complex <archivo>`; el 9 quitó la antigua | `montar_base.py` elige según la versión de ffmpeg |
| «NVENC ha fallado; repito con libx264» sin tarjeta NVIDIA | ffmpeg trae `h264_nvenc` aunque no haya tarjeta | `montar_base.py` solo lo intenta si `nvidia-smi` existe |
| Se cuelan palabras quitadas («al final», «Entonces») al cortar el vertical con los tramos del horizontal | `cortes.py` estira hasta 0,35 s cada borde para no comer sílabas | pasar los tramos del horizontal con `=` en los dos bordes (`=a-=b`): ya vienen afinados |
| `edl`: «sonido desconocido» en todos los efectos | faltaba la carpeta `sonidos/` de la skill de reels (no se copió al adaptarla de `editor-reels`) | restaurada; `preparar` se para si falta la biblioteca o un archivo |
| Remotion: «Google Chrome ran out of memory or disk space» y, a la vez, `alinear` que se corta sin traza | render y alineación (o transcripción) en paralelo: falta RAM, Windows agranda `pagefile.sys` y el disco baja de 8 a 2 GB | un trabajo pesado cada vez (render, `analizar`, `cortar`, `alinear`, `revisar`); repetirlo solo funciona |
| `hyperframes snapshot` falla con `ENOENT … mkdtemp` | ruta de más de ~110 caracteres (MAX_PATH de Windows) | proyectos de HyperFrames y Remotion en rutas cortas (`C:\zonia\…`) |
| `revisar`: `ENOSPC: no space left on device … remotion-stitch-temp-dir` con 2 GB libres | Remotion copiaba la carpeta `public` entera (los vídeos de todos los reels, 1,5 GB) en cada ejecución | `reel.py` le pasa una `public` con solo ese reel, hecha con enlaces duros (`publico_ligero`) |
| Los efectos de un cuerpo propio de escena o doble no suenan (sin error) | `edl_pro.py` solo leía los `sonidos` de la pieza, no los de sus cuerpos | `sonidos_auto` suma los `sonidos` de cada cuerpo a los de la pieza |
| Una sustitución con `sed` deja `recursosinales` en vez de `recursos\finales` | `\f` dentro del texto de reemplazo es un salto de página | para editar textos con barras invertidas, `Edit` o Python con `chr(92)`, nunca `sed` |

## Cosas de cada equipo que conviene saber

- **Sin tarjeta NVIDIA** (casi todos los portátiles y todos los Mac): todo va en la CPU; transcribir 100 s de voz con
  `medium` tarda unos 2,5 min. En Mac con chip de Apple, HyperFrames puede usar Parakeet para inglés, pero en español
  va con whisper.
- **Disco justo:** un fallo a mitad de un render puede ser falta de espacio. Mira el espacio libre antes de culpar al
  script (Windows: `Get-PSDrive C`; Mac: `df -h ~`).
- **Windows y rutas largas:** la carpeta de trabajo va en `C:\zonia\`; Remotion y algunos comandos de HyperFrames no
  arrancan desde rutas de más de ~110 caracteres.
- **Mac:** si un comando no encuentra `ffmpeg` o `node` recién instalados con Homebrew, abre una terminal nueva o usa
  la ruta `/opt/homebrew/bin/`.
- **Dos Python a la vez:** si `npx hyperframes doctor` no ve paquetes que sí están instalados, pon `HYPERFRAMES_PYTHON`
  con la ruta del Python bueno.

---
name: zonia-video
description: Punto de entrada para hacer un vídeo de zonia con Claude. Úsala SIEMPRE que digan «prepara mi equipo», «primera vez», «vídeo nuevo», «tengo una grabación», «sigue con <vídeo>», «¿cómo va <vídeo>?», «cierra <vídeo>», «está aprobado», «cambia mi estilo», «revisa el reel antes de publicar», «¿está listo para publicar?» o «¿retendrá?», o al empezar una conversación de edición sin saber qué toca. Prepara la carpeta de trabajo y el perfil de cada persona, ofrece el menú de estilos de animación, decide qué skill de formato cargar (zonia-reels o zonia-animado), aplica las reglas de ritmo y retención y deja el estado apuntado.
---

# Vídeos de zonia: por dónde empezar

Cada persona del equipo edita sus vídeos con Claude. **La marca es fija** (colores, letras y logo de zonia:
`marca/marca.md`); **el estilo de animación lo elige cada uno** (`estilos/estilos.md`); **el ritmo, los cortes y los
ganchos son los mismos para todos** (abajo y en `references/`). Habla en español, sin jerga, una línea por decisión, y
señala siempre lo que necesita su revisión.

`<skill>` es esta carpeta. La carpeta de trabajo es `C:\zonia\` en Windows y `~/zonia/` en Mac (ruta corta a
propósito: Remotion y HyperFrames fallan en Windows con rutas de más de ~110 caracteres).

## Primera vez: preparar el equipo

1. **Herramientas.** Comprueba Node.js 22 o más, FFmpeg, Git y Python 3.10 o más. Lo que falte:
   - Windows: `winget install OpenJS.NodeJS.LTS Gyan.FFmpeg Git.Git Python.Python.3.12`.
   - Mac: `brew install node ffmpeg git python@3.12` (si no hay Homebrew, dile que lo instale desde brew.sh: pide su
     contraseña y tiene que hacerlo él).
2. **HyperFrames:** `npx skills add heygen-com/hyperframes -g -a claude-code -s '*' -y` y `npx hyperframes doctor`.
3. **Transcripción en español (whisper.cpp)**, necesaria para los subtítulos y para sincronizar con la voz:
   - Mac: `brew install whisper-cpp`.
   - Windows: el binario oficial `whisper-bin-x64.zip` de github.com/ggml-org/whisper.cpp/releases, descomprimido en
     `%LOCALAPPDATA%\Programs\whisper-cpp\`, y la variable de usuario `HYPERFRAMES_WHISPER_PATH` apuntando a su
     `Release\whisper-cli.exe`. Si el sistema de permisos no te deja ejecutar el binario descargado, dale a la persona
     el comando exacto para que lo ejecute ella.
   - Comprueba con un audio corto en español: `npx hyperframes transcribe <audio> --engine whisper --model small
     --language es` tiene que dar cada palabra con su tiempo.
   - Si `doctor` no encuentra Python o sus paquetes aunque estén, puede haber dos Python: pon la variable
     `HYPERFRAMES_PYTHON` con la ruta del bueno.
4. **Carpeta de trabajo:** créala con `brutos/`, `recursos/`, `finales/` y `animados/`, y copia ahí
   `<skill>/plantillas/CLAUDE.md`, `<skill>/plantillas/perfil.md`, un `proyectos.md` vacío (tabla: vídeo, formato,
   estilo, estado) y un `aprendizajes.md` vacío.
5. **Perfil:** pregúntale su nombre y qué ordenador usa, y enséñale el menú de estilos (`estilos/estilos.md`, apartado
   «Cómo se ofrece») para elegir el de por defecto y el tema (claro o noche). Rellena `perfil.md`.
6. **Reels a cámara** (si los va a hacer): desde `<carpeta de trabajo>/reels`, `python <zonia-reels>/scripts/reel.py
   entorno --instalar` y `reel.py preparar` (ver `zonia-reels`).
7. Dile que abra Claude Code en su carpeta de trabajo a partir de ahora.

## Vídeo nuevo

1. Lee `perfil.md`. Pregunta solo lo que falte: qué grabación (o que la deje en `brutos/`), el nombre del vídeo
   (`PascalCase_con_guiones`) y si hay ficha (`brutos/<Vídeo>_ficha.md`, la deja `zonia-guion`): guion, metáfora, lo
   que no puede salir. Si aún no hay guion ni grabación, primero `zonia-guion`.
2. **Estilo de animación:** ofrece el menú (`estilos/estilos.md`, «Cómo se ofrece»), con su estilo por defecto como
   primera opción. Apunta el elegido.
3. Añade su fila a `proyectos.md` (vuelve a leerlo antes) con estado **en edición** y el estilo.
4. Carga la skill del formato y sigue su flujo. Antes de escribir escenas, lee `references/movimiento.md`:
   - grabación a cámara en vertical → `zonia-reels`;
   - solo animación (con voz o sin ella), o una pieza suelta → `zonia-animado`.
5. Entregas: verticales en 2K (1440×2560), renderizadas directamente a ese tamaño. Vistas previas a 720p.

## Seguir un vídeo a medias

1. Lee **solo** su fila de `proyectos.md` y el `README.md` de su proyecto (`reels/trabajo/<reel>/README.md` o
   `animados/<pieza>/README.md`).
2. El README dice qué está hecho, qué falta y el estilo elegido: carga la skill del formato y sigue por el primer paso
   pendiente.

Al terminar cada sesión de trabajo, deja el `README.md` del proyecto al día (qué está hecho, qué falta, con los
comandos exactos para seguir) y la fila de `proyectos.md`.

## Ritmo, cortes y ganchos (igual para todos)

Lo que hace que un vídeo corto se vea hasta el final. No depende del estilo ni de quién lo haga.

**Gancho**
- El fotograma 0 ya tiene el gancho entero, escrito y visual: es la miniatura y lo primero que se ve.
- Primera palabra en los primeros 0,3 s; primera frase terminada antes de 3,5 s.
- Primer cambio de plano antes del segundo 3.
- El remate del gancho (la palabra que lo cierra) se marca: subrayado o en coral, con un golpe de sonido.

**Voz y pausas**
- La voz, como mucho a 1,1x. El ritmo se gana quitando pausas, no acelerando.
- Entre frases, el mínimo silencio posible (una décima). Nada de respiros añadidos «para que se lea»: si algo necesita
  más tiempo, la pieza se queda sobre el plano siguiente.
- Pausas con intención, solo las marcadas en el guion: `/` 0,15 s · `//` 0,2 s · `(S)` 0,45 s; cualquier otra, como
  mucho 0,18 s. Entre gancho y cuerpo, menos de 0,2 s.
- Durante cada `(S)`, algo cambia en pantalla: un silencio con la imagen quieta es por donde se va la gente.
- Quitar tomas repetidas (vale la última completa y fluida), frases a medias, trabas y arranques en falso.

**Cortes y planos**
- Algo cambia en pantalla cada 1–2 s (una pieza que entra, algo que se enciende, un corte). Nunca más de 2,5 s quieto.
- Una idea por frase, una imagen por idea. La imagen explica (el mecanismo, la proporción, la prueba); no repite el
  subtítulo con otras letras.
- Cada cosa entra en la sílaba en que se nombra (±0,05 s), con los tiempos de la alineación, nunca a ojo.
- Lo que se lee se queda quieto: 1 s una frase corta + 0,25 s por palabra a partir de la tercera; una lista completa,
  2 s.
- No se repite el mismo plano o pieza dos veces seguidas. En reels a cámara, una escena a pantalla completa cada
  10–15 s.
- El encuadre solo cambia en los cortes, con un salto claro (0,1 o más de zoom); dentro del tramo, un empuje muy lento.
  Nunca zooms cortos de «tambaleo» ni nada que parpadee.
- Corte en J al salir de una escena; cambio de plano sin corte partiendo el tramo.
- Un momento fuerte por vídeo, construido hacia él; el rebote elástico y el golpe grande, solo ahí.

**Cierre**
- El cierre tiene su propia pieza. La última frase repite una palabra del gancho, para que la segunda vuelta encaje.
- Duración: 30–55 s.

**Sonido**
- Voz a −14 LUFS, pico por debajo de −1 dBTP.
- Un sonido discreto por cada cosa que entra; de 4 a 6 golpes graves en todo el vídeo.
- Con música de fondo, que baje cuando habla la voz (en torno a 0,12 de volumen).

## Antes de publicar un vertical: revisión de retención

Todo vertical para Reels, TikTok o Shorts pasa esta revisión **al terminar la edición y antes del render final**; si
hay variantes (ganchos A, B, C), cada una. Las comprobaciones, los umbrales y el informe están en
`references/revision-retencion.md`: léelo entero la primera vez de cada conversación.

```
python <skill>/scripts/retencion.py <render.mp4> --transcripcion <palabras.json> --eventos <instantes> [--voz <voz sola.wav>] [--marcados <inicios de los (S)>] --informe <proyecto>/retencion.md
```

- `--transcripcion`: las palabras con tiempos (reels: `trabajo/<reel>/alineacion/tiempos.json`; HyperFrames:
  `transcript.json`). `--eventos`: los instantes de la tabla de sincronía (cada pieza o texto que entra y cada corte).
  `--voz`: la voz sola si la hay (con música, los silencios no se ven).
- El script mide lo medible y deja como **REVISAR** lo que pide mirar fotogramas (texto en el fotograma 0, imagen en
  los silencios, subtítulos, zona segura, contraste, portada): compruébalo y rellena esas filas. Nunca inventes un
  valor: lo que no se pueda medir, **SIN DATO** con el motivo.
- Enseña la tabla y el veredicto. Con alguna **FALLA**, no hagas el render final sin su visto bueno; los **AVISOS** se
  enseñan y no bloquean.

## Revisión de marca

Antes del render final, comprueba con `marca/marca.md`: solo colores de la paleta (nada de azules), Nunito, Geist y
Geist Mono, el logo correcto para el fondo, un acento por línea y cada cifra con su fuente.

## Cerrar un vídeo (cuando lo aprueba)

1. Comprueba que la entrega esté en `finales/` (2K, 1440×2560).
2. Pregúntale qué le ha gustado y qué cambiaría; apúntalo en `aprendizajes.md` con fecha y vídeo. Lo que repita o diga
   que quiere siempre, pásalo a su `perfil.md`.
3. Propón, con permiso y la lista de lo que ocupa, borrar los brutos de ese vídeo y los renders intermedios. Siempre a
   la papelera.
4. Pon su fila de `proyectos.md` en **cerrado**.

## Cambiar de estilo o de perfil

«Cambia mi estilo», «quiero probar otro estilo»: enseña el menú y actualiza `perfil.md`. El ritmo y la marca no
cambian con el estilo.

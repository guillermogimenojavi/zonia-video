---
name: zonia-animado
description: "Vídeos de zonia solo de animación, sin cámara, y piezas sueltas (título, cortinilla, gráfico, mapa, logo animado), con HyperFrames. Úsala al pedir «un vídeo animado», «una animación de…» o «un vídeo sin salir yo»."
---

# zonia · solo animación (HyperFrames)

## Flujo

1. **Empieza por `zonia-video`** si no lo has hecho: perfil de la persona y estilo de animación elegido para este
   vídeo (`zonia-video/estilos/estilos.md`).
2. **Carga la skill `hyperframes`** y sigue su contrato y su bucle de trabajo (y `hyperframes-registry` antes de dibujar
   a mano un efecto con nombre).
3. **Proyecto en ruta corta:** `npx hyperframes init <carpeta de trabajo>/animados/<pieza> --example blank
   --non-interactive` (con rutas largas, `snapshot` falla en Windows). Deja un `README.md` con el plan, el estilo
   elegido y lo que falta.
4. **Marca (obligatoria):** `zonia-video/marca/marca.md`. Paleta como variables CSS (fondo marfil `#FBF4E7` y texto
   tinta `#3A2A21`, o modo noche `#1F1A17` con texto `#F6EBDD`; coral teja `#DF663F` solo de acento, nunca en
   degradado). Letras: Nunito viene con HyperFrames; Geist y Geist Mono no: copia `zonia-video/marca/fuentes/` a
   `assets/fonts/` y decláralas con `@font-face` (las tres, para no depender de la red). Logo de
   `zonia-video/marca/logo/` en `assets/`.
5. **Estilo:** parte de la muestra del estilo elegido (`zonia-video/estilos/muestras/`): sus formas y su movimiento,
   con los colores y las letras de zonia.
6. **Con voz:** transcribe con `npx hyperframes transcribe <audio> --engine whisper --model small --language es`. Para
   sincronizar al milímetro, alinea con `python <zonia-reels>/scripts/alinear.py` (más preciso que Whisper) y clava
   cada animación a su palabra. Sin voz, música de `recursos/` o generada (`media-use`).
7. **Texto en pantalla** que no sea lo que dice la voz: enséñalo antes de animarlo y señala lo que necesite revisión
   (cifras con su fuente).
8. **Movimiento:** lee `zonia-video/references/movimiento.md` y copia `<skill>/plantilla/movimiento.js` a `assets/`
   (revelado con máscara, cifra que rueda, arco con estela, iris, trazo vivo y grano, como funciones de la línea de
   tiempo GSAP; el HTML que necesita cada una está en sus comentarios). El iris tapa todo: quita los textos antes, o
   `check` da `text_occluded`.
9. `npx hyperframes check --json` sin errores, `snapshot` de los momentos clave y vista previa a 720p:
   `python <skill>/scripts/resolucion.py <proyecto> previa`, `render -q draft` y vuelta a `base`. Si es un vertical para
   redes, la **revisión de retención** de `zonia-video` antes del render final (con `transcript.json` y los
   `data-start` de cada escena como `--eventos`); con alguna FALLA, no hagas el final sin su visto bueno.
10. **Entrega:** vertical directamente en 2K (`resolucion.py <proyecto> entrega`, `render -q delivery`, vuelta a
    `base`), en `finales/`. Fila en `proyectos.md`.

Un trabajo pesado cada vez (render, transcribir): sin tarjeta NVIDIA todo va en la CPU.

## Ritmo y retención en los animados con voz (probado en vídeos que funcionaron)

Valen con cualquier estilo:

- **Gancho visual desde el primer fotograma:** la pregunta-gancho ya escrita (una pegatina, un rótulo), y algo que se
  mueve. Si ayuda, detrás se ve ya el final de la historia y se «rebobina» cuando empieza la voz.
- **Remate del gancho:** la palabra que lo prepara, subrayada; la que lo cierra, en coral y con un golpe de sonido.
- **La pantalla nunca queda vacía:** el escenario (el mapa, la calle, la mesa) siempre a la vista; las figuras no lo
  tapan.
- **Un cambio de imagen por frase**, y algo que se mueve en cada `(S)`.
- **Tipografía cinética** cuando la frase es el mensaje: una línea pequeña y la palabra clave grande; cada palabra
  entra al decirla.
- **Voz:** como mucho a 1,1x; pausas solo las del guion (`/` 0,15 s · `//` 0,2 s · `(S)` 0,45 s; lo demás, como mucho
  0,18 s); entre gancho y cuerpo, menos de 0,2 s.
- **Música** a 0,12 bajo la voz y efectos suaves en cada aparición.
- **Logo de una organización** cuando se nombra, en la versión que se lea sobre el fondo.
- **Prueba A/B:** el mismo vídeo en tema claro y en modo noche, si la persona quiere comparar.

Para animados sin voz o piezas sueltas: una metáfora por pieza, cifras clave en coral, efectos suaves en cada
aparición y música que baja si entra una voz.

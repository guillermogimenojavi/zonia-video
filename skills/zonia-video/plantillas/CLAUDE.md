# Edición de vídeo · zonia

Aquí se editan los vídeos de zonia (zonia.space) con Claude. Habla en español, sin jerga, una línea por decisión, y
señala siempre lo que necesita revisión de la persona.

## Cómo empezar

Usa la skill **`zonia-video`**: arranca un vídeo nuevo, sigue uno a medias («sigue con <vídeo>») y lo cierra. Antes de
cada vídeo lee `perfil.md` (quién es, su estilo de animación por defecto, su voz). **No releas todo:** para seguir un
vídeo basta su fila de `proyectos.md` y el `README.md` de su proyecto.

| Tarea | Skill |
|---|---|
| Guion y gancho antes de grabar | `zonia-guion` |
| Vertical hablando a cámara (Reels, TikTok, Shorts) | `zonia-reels` |
| Solo animación, sin cámara, o una pieza suelta | `zonia-animado` |
| Algo falla | `zonia-autocorreccion` (se arregla la skill, no se sortea) |

## Carpetas

Esta carpeta es la de trabajo, en una ruta corta (Remotion y HyperFrames fallan en Windows con rutas de más de ~110
caracteres): `brutos/` (grabaciones), `recursos/` (música, capturas, logos de terceros), `finales/` (entregas),
`reels/` (el proyecto de Remotion de los verticales a cámara) y `animados/<pieza>/` (los proyectos de HyperFrames).

## Reglas fijas

- **Marca obligatoria:** colores, letras (Nunito, Geist y Geist Mono) y logo de zonia, según `marca/marca.md` de la
  skill `zonia-video`. El estilo de animación lo elige cada persona; la marca, no.
- **Entregas:** verticales en 2K (1440×2560), renderizadas directamente a ese tamaño, sin copia en 4K ni 1080p.
- **Vista previa a 720p** (720×1280) antes del render final: solo sirve para ver animaciones y texto. La alta calidad,
  solo en la entrega.
- **Verticales para redes:** gancho visual y escrito desde el primer fotograma; la voz, como mucho a 1,1x (el ritmo se
  gana con las pausas); pasan la revisión de retención de `zonia-video` antes de la entrega.
- **Voz a −14 LUFS.**
- **Borrar** (brutos al terminar, renders intermedios): siempre con permiso, con la lista y lo que ocupa, a la papelera.
- **Un trabajo pesado cada vez** (render, transcribir, alinear, revisar): dos a la vez agotan la memoria y el disco.
- **Transcribir en español con HyperFrames:** `--model small --language es`.

## Registros

`proyectos.md` (estado de cada vídeo: actualízalo al cambiar) y `aprendizajes.md` (gustos nuevos, con fecha y vídeo;
los confirmados pasan a `perfil.md`). Vuelve a leerlos justo antes de escribir y añade al final, sin reescribir lo de
otras conversaciones.

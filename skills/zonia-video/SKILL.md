---
name: zonia-video
description: "Entrada para hacer un vídeo de zonia. Úsala al decir «prepara mi equipo», «vídeo nuevo», «tengo una grabación», «sigue con <vídeo>», «cierra <vídeo>», «cambia mi estilo» o «¿está listo para publicar?»: prepara el equipo y el perfil, ofrece el estilo de animación y carga zonia-reels o zonia-animado."
---

# Vídeos de zonia: índice

**Marca fija** (`marca/marca.md`) · **estilo de animación elegido por cada persona** (`estilos/estilos.md`) · **ritmo
igual para todos** (`references/ritmo.md`). Español, sin jerga, una línea por decisión; señala lo que necesite su
revisión. `<skill>` es esta carpeta. Carpeta de trabajo: `C:\zonia\` (Windows) o `~/zonia/` (Mac).

**Lee solo lo que pida el paso** (con `Grep` del encabezado o `Read` con `offset`/`limit`), nunca una guía entera
«por si acaso».

| Tarea | Lee | Cuándo |
|---|---|---|
| Preparar el equipo | `references/preparar.md` | solo la primera vez |
| Elegir estilo | `estilos/estilos.md` («Cómo se ofrece») | al empezar cada vídeo |
| Ritmo, cortes y ganchos | `references/ritmo.md` | al planear el vídeo y al revisarlo |
| Tiempos y curvas de animación | `references/movimiento.md` | antes de escribir escenas |
| Revisión de retención | `references/revision-retencion.md` | antes del render final de un vertical |
| Colores, letras y logo | `marca/marca.md` | al montar y en la revisión de marca |

## Vídeo nuevo

1. Lee `perfil.md`. Pregunta solo lo que falte: la grabación (en `brutos/`), el nombre (`PascalCase_con_guiones`) y si
   hay ficha (`brutos/<Vídeo>_ficha.md`). Sin guion ni grabación, primero `zonia-guion`.
2. Ofrece el estilo de animación, con el suyo por defecto como primera opción.
3. Fila en `proyectos.md` (vuelve a leerlo antes): **en edición** y el estilo.
4. Carga el formato: a cámara en vertical → `zonia-reels`; solo animación o pieza suelta → `zonia-animado`.
5. Vista previa a 720p; entrega en 2K (1440×2560), renderizada directamente a ese tamaño.

## Seguir un vídeo

Lee **solo** su fila de `proyectos.md` y el `README.md` de su proyecto (`reels/trabajo/<reel>/` o
`animados/<pieza>/`), carga su skill y sigue por el primer paso pendiente. Al acabar cada sesión, deja el README (hecho,
falta, comandos exactos) y la fila al día.

## Antes del render final

- **Retención** (verticales para redes; cada variante de gancho por separado):
  `python <skill>/scripts/retencion.py <render.mp4> --transcripcion <palabras.json> --eventos <instantes> [--voz <voz.wav>] [--marcados <(S)>] --informe <proyecto>/retencion.md`.
  Detalle de cada argumento y de las filas REVISAR en `references/revision-retencion.md`. Con alguna **FALLA**, no hay
  render final sin su visto bueno; nunca inventes un valor (**SIN DATO** con el motivo).
- **Marca:** solo colores de la paleta, Nunito, Geist y Geist Mono, el logo correcto para el fondo, un acento por línea
  y cada cifra con su fuente.

## Cerrar un vídeo

1. La entrega, en `finales/` (2K).
2. Qué le ha gustado y qué cambiaría → `aprendizajes.md` con fecha y vídeo; lo que quiera siempre → su `perfil.md`.
3. Propón borrar brutos y renders intermedios: con permiso, con la lista y lo que ocupa, a la papelera.
4. Fila de `proyectos.md` en **cerrado**.

«Cambia mi estilo»: enseña el menú y actualiza `perfil.md`. El ritmo y la marca no cambian con el estilo.

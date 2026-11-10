---
name: zonia-reels
description: "Edita reels verticales de zonia (Instagram, TikTok, Shorts) de una persona hablando a cámara, con motion graphics en Remotion en la marca zonia, sincronizados palabra a palabra con su voz. Quita pausas y tomas repetidas, reencuadra a 9:16 sin tapar la cara, alterna cara con pieza, escena y primer plano, pone doble pantalla si la piden y añade subtítulos, capítulos, sonidos y portada. Úsala SIEMPRE que quieran editar un reel o un vídeo corto o vertical grabado a cámara («edita este reel», «hazme el reel», «subtítulos animados», «quita los silencios», «doble pantalla»), dejen un bruto para redes o quieran retocar uno hecho con ella. Solo animación, sin cámara: zonia-animado."
---

# Reels de zonia: índice

Convierte una grabación a cámara en un reel vertical listo para publicar. Tú haces lo técnico y lo creativo; la
persona aporta el vídeo y opina. Háblale en español y sin jerga; no le pidas decisiones técnicas.

**Antes de nada, `zonia-video`:** su perfil y el estilo de animación elegido para este vídeo. **No leas todo.** Sigue
la tabla y abre solo el apartado del paso en el que estás (`references/pasos.md`) y la guía que ese paso nombre.
`<skill>` es esta carpeta; los comandos se lanzan desde `<carpeta de trabajo>/reels` (`C:\zonia\reels` o
`~/zonia/reels`).

## Lo que hace bueno un reel

La imagen cuenta lo que dice la voz **en la sílaba en que lo dice**: tiempos exactos por alineación forzada (nunca los
de Whisper), un plan frase a frase, piezas que se encienden al nombrarlas, tres planos que se alternan (cara con pieza,
escena a pantalla completa, primer plano) y doble pantalla si la piden, datos verificados y material real. Marca de
zonia siempre; estilo de animación, el que elija la persona; piezas, rótulos y metáforas, distintos en cada reel.

## Pasos

| Paso | Comando (desde la carpeta `reels`) | Detalle |
|---|---|---|
| 0 · Equipo y proyecto | `python <skill>/scripts/reel.py entorno` · `reel.py preparar` | `pasos.md` § 0 |
| 1 · Analizar | `reel.py analizar brutos/<video>.mp4 <reel> --nombres "…"` | § 1 |
| 2 · Cortar | `reel.py cortar <reel> --tramos "a-b,c-d"` (`--clasico` para el modo clásico) | § 2 |
| 3 · Tiempos de cada palabra | repasa `alineacion/guion.txt` · `reel.py alinear <reel>` | § 3 |
| 4 · Plan frase a frase (lo valida la persona) | `trabajo/<reel>/README.md` | § 4 · `oficio.md` § 3-4 · `marca.md` § 4 |
| 5 · Datos y logos | `reel.py logos "…"` · `reel.py captura <reel> <url>` | § 5 |
| 6 · Guion | `trabajo/<reel>/guion_pro.json` · `reel.py edl <reel>` | § 6 · `guion-pro.md` |
| 7 · Revisar | `reel.py revisar <reel> auto --zonas` · `reel.py sonido <reel>` | § 7 |
| 8 · Render y entrega | `reel.py render <reel> --nombre v1 --previa` (720p) · `--nombre final` (2K) · `portada` | § 8 |

Otros apartados de `pasos.md`: doble pantalla, modo clásico (clips de móvil, grabación doble) e iterar con el feedback.

## Reglas que no se saltan

- **Modo pro** por defecto (`guion_pro.json`; `edl`, `revisar`, `render` y `portada` lo usan si existe); clásico
  (`cortar --clasico`, `guion.json`) solo para clips de móvil a pantalla completa o grabación doble.
- **El plan, con los textos de pantalla, se enseña antes del guion.** Marca lo que necesite su revisión.
- **Fotograma 0 con el gancho entero**, primer cambio de plano antes del segundo 3, un cambio visual cada 1-2 s, y el
  resto de reglas de ritmo de `zonia-video` («Ritmo, cortes y ganchos»).
- **Marca de zonia** (`zonia-video/marca/marca.md`): sus colores, Nunito y Geist, y su logo; ya están en la plantilla.
  Textos en tipo oración y con fuente en cada cifra (`marca.md` § 3). La cara nunca tapada. Cada reel elige tema claro
  u oscuro.
- **Estilo de animación:** el elegido en `zonia-video`, en escenas a pantalla completa, piezas propias y portada.
- **Movimiento:** `zonia-video/references/movimiento.md` y `src/componentes/movimiento.tsx`; lo ya probado está en
  `estilo.md` § 6 y 9 y manda.
- **Antes del final:** revisión de retención de `zonia-video` si va a redes, y revisión independiente con un
  subagente (`oficio.md` § 9). El reel sale sin música (se añade al publicar).
- **Un trabajo pesado cada vez** (render, analizar, cortar, alinear, revisar).
- **Si algo falla:** `zonia-autocorreccion`; errores conocidos en `problemas.md`.

## Referencias (abre solo la que toca)

| Guía | Qué tiene | Cuándo |
|---|---|---|
| `references/pasos.md` | cada paso en detalle, doble pantalla, modo clásico, feedback | en cada paso, solo su apartado |
| `references/oficio.md` | el método: planos, plan frase a frase, qué pieza pide cada frase, ritmo, revisión | al hacer el plan (§ 3-4) y al revisar (§ 9) |
| `references/marca.md` | qué cuenta zonia, lista de revisión de textos, piezas por tema | al escribir textos (§ 3) y elegir piezas (§ 4) |
| `references/guion-pro.md` | formato de `guion_pro.json`, catálogo de piezas, pieza propia | al escribir el guion |
| `references/estilo.md` | zonas, temas, colores, movimiento y reglas de oficio | al dudar del aspecto |
| `references/guion.md` | formato del modo clásico | solo en modo clásico |
| `references/problemas.md` | errores frecuentes y su arreglo | cuando algo falla |
| `references/referencias.md` | analizar un reel de referencia sin copiarlo | si pasan un reel de referencia |

Ejemplos técnicos en `ejemplos/` (reels de noticias de IA de la plantilla original; sirven por el formato, los tiempos
y las piezas, no por el contenido ni los colores): `guion_pro_ejemplo.json` (noticia), `guion_pro_muse.json`
(herramienta con piezas propias) y `guion_pro_haiku55.json` (con doble pantalla).

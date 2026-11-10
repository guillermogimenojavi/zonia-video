# Revisión de retención del vídeo vertical antes de publicar

La aplican todas las skills que sacan un vertical: `zonia-reels` y `zonia-animado`.

Vale para Instagram Reels, TikTok y YouTube Shorts.

Solo retención antes de publicar: la marca se revisa con `marca/marca.md` y la retención real, con las métricas después de publicar.

## Para qué sirve

El tiempo de visualización es la señal que más pesa para que una plataforma enseñe un vídeo corto a más gente. Ninguna herramienta predice la viralidad, pero sí se puede quitar, antes de publicar, lo que hace que la gente se vaya. Eso es lo que hace esta revisión.

## Cuándo se ejecuta

Al terminar la edición de cada vertical y antes de exportar la versión final. Si hay variantes (por ejemplo, ganchos A, B y C), se revisa cada una por separado.

## Cómo entrega el informe

Una tabla con cuatro columnas (comprobación, valor medido, estado OK / AVISO / FALLA, cómo arreglarlo), más una línea final con el veredicto.

- Si hay alguna **FALLA**, no se exporta la versión final sin el visto bueno de quien hace el vídeo.
- Los **AVISOS** se enseñan, pero no bloquean.
- Si una comprobación no se puede medir, se marca **SIN DATO** y se dice por qué. Nunca se inventa un valor.

## A · Comprobaciones automáticas

| # | Comprobación | Cómo medirla | OK | AVISO | FALLA |
|---|---|---|---|---|---|
| 1 | Primera palabra | Inicio del habla en la transcripción con marcas de tiempo por palabra (whisper) o con `silencedetect` | ≤ 0,3 s | 0,3-0,6 s | > 0,6 s |
| 2 | Texto en pantalla al empezar | El gancho escrito aparece desde el primer fotograma | En el fotograma 1 | Antes de 0,5 s | Después de 0,5 s |
| 3 | Primera frase del gancho | Fin de la primera frase hablada (transcripción) | ≤ 3,5 s | 3,5-4,5 s | > 4,5 s |
| 4 | Silencios marcados con (S) | `silencedetect` cruzado con el guion | 0,4-0,5 s | 0,5-0,7 s | > 0,7 s |
| 5 | Silencios sin marcar | `silencedetect` (umbral de unos -35 dB) | Ninguno de más de 0,3 s | Uno o dos de entre 0,3 y 0,5 s | Alguno de más de 0,5 s |
| 6 | Cambio visual | Detección de cambio de escena (`scdet` o `select='gt(scene,0.3)'`) más la aparición de textos | Algo cambia cada ≤ 2,5 s | Un tramo de 2,5-4 s sin cambios | Un tramo de más de 4 s sin cambios |
| 7 | Imagen durante los silencios | Durante cada (S), la imagen cambia o aparece texto | Siempre | — | Fotograma quieto durante un (S) |
| 8 | Duración total | `ffprobe` | 30-55 s | 55-60 s | > 60 s |
| 9 | Formato | `ffprobe` | 720 × 1280 (vista previa) o 1440 × 2560 (entrega, 2K), 9:16, 30 fps o más | — | Otro tamaño o proporción (bandas negras, recorte) |
| 10 | Subtítulos | Incrustados y sincronizados con la transcripción (desfase medio) | Desfase de 0,15 s o menos | 0,15-0,3 s | Sin subtítulos o desfase de más de 0,3 s |
| 11 | Zona segura | Superponer las plantillas de Instagram y TikTok y usar la más estricta. Si no hay plantillas: nada clave en los 250 px de arriba ni en los 250 px de abajo, ni pegado al lado derecho, donde van los botones (valor orientativo) | Todo dentro | Algún texto secundario fuera | El gancho o los subtítulos tapados |
| 12 | Legibilidad del texto | Contraste entre el color del texto y el del fondo (WCAG) | 4,5:1 o más | 3:1-4,5:1 | Menos de 3:1 |
| 13 | Recorte de la portada | El texto del fotograma de portada cabe en el recorte central 3:4 (cuadrícula del perfil) y 4:5 (vista en el feed de Instagram) | Cabe entero | Se corta algo secundario | Se corta el título |
| 14 | Sonido | Sonoridad igual a la del resto de vídeos del pipeline (EBU R128) y picos que no pasen de -1 dBTP | Dentro | Hasta 1 LU de diferencia | Saturación o más de 2 LU de diferencia |
| 15 | Final y comienzo | Comparar el último fotograma con el primero: si el final encaja con el inicio, se favorece que se vuelva a ver | Encaja | No encaja (solo aviso) | — |

## B · Cosas que se miden para comparar (no bloquean)

Se apuntan en el informe para comparar un vídeo con otro. No tienen valor bueno ni malo hasta que haya datos propios.

- **Velocidad del habla:** palabras por minuto, en total y solo en el gancho.
- **Número de cortes o cambios visuales por cada 10 segundos.**
- **Proporción del tiempo con texto en pantalla.**
- **Cuántas palabras dice el gancho en los primeros 3 segundos.**

## Umbrales

Los umbrales de los apartados A y B son un punto de partida. Se ajustan cuando haya datos de retención real de los vídeos de zonia (las estadísticas de cada plataforma).

## Cómo se ejecuta

`python <zonia-video>/scripts/retencion.py` mide las comprobaciones 1, 3, 4, 5, 6, 8, 9, 14 y 15 y el apartado B, y
escribe el informe con las filas 2, 7, 10, 11, 12 y 13 en «REVISAR» para completarlas mirando fotogramas. Detalles en la
sección «Antes de publicar un vertical» de `zonia-video/SKILL.md`. Notas:

- La detección de cortes de ffmpeg no ve las piezas que entran poco a poco ni los saltos entre planos de la misma
  pared: la comprobación 6 solo es fiable con `--eventos` (la tabla de sincronía de la skill).
- Con música de fondo, `silencedetect` no distingue la voz: la primera palabra y los silencios salen de la
  transcripción o de `--voz`.

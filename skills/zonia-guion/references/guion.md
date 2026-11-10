# Guion de reel o Short

De una idea a un guion de 30 a 60 s que se termina de ver, en la voz de quien lo graba, puntuado antes de grabar.

## Antes de escribir

1. Lee `perfil.md` de la carpeta de trabajo (`C:\zonia\perfil.md` o `~/zonia/perfil.md`): cómo habla esa persona,
   a qué ritmo (palabras por minuto) y qué no quiere decir. El guion lo va a decir ella en voz alta.
2. Lee `datos/hooks.json`: 26 fórmulas de gancho, cada una con plantilla, ejemplo de zonia, rótulo, para qué sirve y
   cómo se estropea. Las reglas de arriba del archivo valen para todas.
3. Si la idea es floja, no rellenes: una sola pregunta con qué pasó, dónde y qué costó. Un reel necesita una cosa
   concreta y verdadera.
4. Un reel = una idea. Si salen dos, son dos reels: dilo.

## Forma

```
0-2 s         GANCHO     frase dicha y rótulo, escritos por separado. Algo se mueve en el primer fotograma.
2-7 s         LO QUE ESTÁ EN JUEGO   por qué le importa a quien mira. Una frase.
7 s-…         CUERPO     una idea por golpe; la imagen cambia en cada uno (marca entre corchetes qué se dibuja).
3 s finales   CIERRE     la conclusión que condensa la pieza (sin lección: «Pues…» vale).
última frase  BUCLE      repite una palabra del gancho para que la segunda vuelta encaje.
```

De 30 a 60 s (la revisión de retención pide 30-55 s). La voz, como mucho a 1,1x: el ritmo se gana con las pausas, no
acelerando.

## Pausas marcadas en el guion

Se escriben en el guion para que quien edita sepa dónde respirar y nada más:

| Marca | Pausa | Cuándo |
|---|---|---|
| `/` | 0,15 s | entre dos ideas de la misma frase |
| `//` | 0,2 s | antes de un dato o de un giro |
| `(S)` | 0,45 s | silencio con intención: algo cambia en pantalla mientras dura |

Cualquier otra pausa, como mucho 0,18 s. Entre el gancho y el cuerpo, menos de 0,2 s.

## El proceso

1. **Tres ganchos de fórmulas distintas** que encajen de verdad con la idea, cada uno con frase dicha y rótulo
   (seis palabras como mucho).
2. **Puntúalos:** un gancho por línea en un archivo y `python <skill>/scripts/hookscore.py ganchos.txt`. Enseña el
   orden. Si el mejor no llega a 50, aún no hay gancho.
3. **Escribe el guion** con el ganador: frases cortas, como habla esa persona, sin nada que tenga que ensayar.
4. **Mídelo:** `python <skill>/scripts/beats.py guion.txt --target <segundos> --wpm <las de su perfil>` (170 si aún
   no se ha medido). Arregla cada aviso: gancho de más de 3 s, golpes de más de 4 s sin cambio en pantalla, tramos sin
   nada concreto, sin bucle.
5. **Quítale el aire de IA** (`references/humanizar.md`).
6. **Entrega:** el guion en un bloque, los rótulos aparte con sus tiempos, y el resumen (gancho y puntuación, duración,
   número de rótulos, resultado del detector).

## Rótulos en pantalla

- Seis palabras como mucho; el del gancho, desde el primer fotograma.
- Zona segura en 1080×1920: nada clave en los 250 px de arriba ni de abajo ni pegado a la derecha.
- Subtítulos siempre (la mayoría lo ve sin sonido); los pone la skill de vídeo.

## Datos

zonia enseña datos oficiales y dice de dónde sale cada cifra. En el guion, igual: ninguna cifra sin fuente oficial
comprobada. Si falta, `[DATO PENDIENTE]` y se busca antes de grabar. Los casos inventados se declaran («imagina…»).

## Ficha para editar

Con su visto bueno, la ficha va a `brutos/<Vídeo>_ficha.md` de su carpeta de trabajo: vídeo, formato y skill
(`zonia-reels` o `zonia-animado`), idea, metáfora y su significado, guion con las pausas y las marcas de animación,
palabras o cifras en pantalla (con fuente), estilo de animación si ya lo sabe y lo que no puede salir. Graba la voz y
dice en Claude Code «vídeo nuevo <Vídeo>».

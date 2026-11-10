# Quitar el aire de IA

Dos scripts que funcionan de verdad; úsalos, no lo hagas a ojo. Leen `datos/slop.json` (español, con el vocabulario
comodín, los anglicismos, los tics de texto de IA y los de Instagram). Si alguien del equipo usa una palabra
que la lista quita, sácala del archivo.

```
python <skill>/scripts/humanize.py borrador.txt -o limpio.txt --report   # limpia y enseña qué cambió
python <skill>/scripts/detect.py borrador.txt limpio.txt                  # puntúa antes y después
```

## Qué arregla solo

1. **Caracteres invisibles** (espacios de ancho cero, marcas de agua): los borra todos.
2. **Tipografía:** raya → coma, comillas inglesas → « », puntos suspensivos de un carácter → «...».
3. **Léxico:** potenciar, desbloquear, sinergia, «en el mundo actual», «la clave es», «sígueme para más», anglicismos de
   la marca (mindset → forma de pensar, insight → hallazgo)… cambiados por una palabra llana o borrados.

## Qué solo señala (lo reescribes tú)

«No es solo X, es Y», «no X, sino Y» (uno por pieza como mucho), «¿El resultado?», tríadas automáticas, lecciones al
espectador («deberías», «recuerda»), cierres tipo «En resumen», cebos, preámbulos de vídeo, emojis, muros de hashtags,
gritos en mayúsculas. Reescribe cada línea a mano manteniendo el sentido y vuelve a pasar `detect.py`.

## Las cinco comprobaciones de `detect.py` (0-100, más alto = más humano)

Variación en la longitud de las frases, cosas concretas (cifras y nombres), densidad de léxico de IA, huella tipográfica
y voz (marcas de habla como «Pues» o «Y» de bisagra, primera y segunda persona, estructuras de IA). PASA con 70 de media
y ninguna por debajo de 55. Dos vueltas es normal; cinco significa que hay que escribirlo de nuevo.

Son heurísticas locales: no son GPTZero ni nada parecido. Nunca digas que un texto es «indetectable». Enseña siempre
el texto limpio con la nota, nunca la nota sola. Textos de menos de 25 palabras (ganchos, comentarios): basta
`humanize.py`; la puntuación necesita más texto.

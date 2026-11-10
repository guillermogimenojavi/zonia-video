# Sistema visual y preferencias

## Índice

1. Principios
2. Zonas del lienzo en el modo pro
3. Zonas del lienzo en el modo clásico
4. El aspecto del modo pro (marca zonia)
5. Subtítulos
6. Movimiento
7. Sonido
8. Marca
9. Reglas de oficio que se mantienen

## 1. Principios

- **La marca es zonia y no se elige** (`zonia-video/marca/marca.md`), con dos temas que se eligen por reel (`"tema"` en
  el guion; por defecto, el del perfil de la persona o el de `marca.json`, que es el claro):
  - **claro (por defecto, como la web):** fondo marfil `#FBF4E7`, texto tinta `#3A2A21`, tarjetas blanco cálido
    `#FFFDF8` y crema `#F2E4CC`;
  - **noche:** fondo `#1F1A17`, texto `#F6EBDD`, tarjetas `#2A2320`.
  En los dos, **el coral teja `#DF663F` es el único acento** (la palabra clave, una cifra, lo que se enciende); como
  texto pequeño sobre marfil, terracota `#B74B25`. Arenas y marrones (`#D3B38D`, `#B89A78`, `#8C7360`, `#6B5345`) son
  los tonos secundarios. Tarjetas sólidas con borde fino; nada de efecto cristal.
- **El acento nunca va en degradado:** cajas, barras y monedas de acento, lisas. Puede rellenar una caja pequeña (la
  línea con `caja` de un titular, la caja de una `sentencia`), con el texto en marfil.
- **Lo que va directamente sobre la grabación no cambia con el tema:** subtítulos, titulares y sentencias sueltos, en
  marfil con un trazo noche; la palabra que suena, en coral claro (`#F0A07A`). En el tema claro, sobre una escena (fondo
  marfil), los subtítulos pasan solos a noche.
- **Letras de zonia, en local** (`editor/public/fonts`, no hace falta internet): **Nunito** 800 en titulares,
  subtítulos y etiquetas; **Geist** 500 en el texto corrido; **Geist Mono** para cifras que se alinean.
- **Mayúsculas solo en las etiquetas cortas** (rótulos, capítulos, títulos de tarjeta, pastillas, botones). Titulares,
  sentencias, titulares de escena, opciones y subtítulos van en tipo oración, tal como se escriben en el guion.
- **Iconos lineales** dentro de cuadrados redondeados con un fondo tenue del color de acento.
- **Verde oliva, trigo y terracota oscura solo marcan estados** (sí, aviso, no); no son decoración.
- **Todo recto.** Nada inclinado, ni sacudidas de cámara, ni destellos blancos, ni nada que parpadee.
- **Poco a la vez.** El protagonista es la persona que habla.
- **El estilo de animación lo elige cada persona** (`zonia-video/estilos/estilos.md`): manda en las escenas a pantalla
  completa, las piezas propias y la portada. Las piezas del catálogo mantienen su sistema, ya en los colores de zonia.
- **El aspecto es de zonia, no de un reel de referencia.** De las referencias se aprende el oficio (ritmo, cómo entran
  las cosas); el diseño sale de aquí.

## 2. Zonas del lienzo en el modo pro (1080×1920)

| Zona | Píxeles | Qué va |
|---|---|---|
| Interfaz de Instagram arriba | y 0–220 | Nada que leer |
| Capítulo (izquierda) y logo de la marca (derecha) | y 234–318 | Dos pastillas oscuras |
| Cara | y 305–831 | La persona. Aquí no va nada |
| Pieza sobre el pecho | y 916–1376, x 80–1000 | Una cada vez. Lo que hay que leer, hasta x≈940 |
| Subtítulos | y 1400–1540 | Una o dos líneas de 56 px |
| Interfaz de Instagram abajo | y 1560–1920 | Nada que leer (usuario, texto, audio) |
| Botones de Instagram | x > 950, y 1000–1560 | Nada que leer: el borde de una tarjeta puede quedar debajo; su contenido, no |

- **Escenas a pantalla completa:** titular en y 344; contenido hasta y 1340, entre x 72 y 1008 (lo que hay que leer por debajo de y 1000, hasta x≈925).
- **Doble pantalla** (pieza `doble`): la costura va en y 900. Arriba, el capítulo y el logo siguen en y 234–318 y lo que hay que leer va entre y 340 y 870, de x 72 a 1008. Abajo, la persona: el pelo empieza unos 38 px bajo la costura y la barbilla queda en y≈1348, 52 px por encima de los subtítulos, que no se mueven. Constantes en `DOBLE` (`sistema.ts`).
- **Texto grande suelto** (titular, sentencia): centrado y de 800 px de ancho como mucho (llega a x 940).
- **Tamaño mínimo de letra: 26 px.** Por debajo no se lee en un móvil. Rótulos, 28 px.
- **Portada en Instagram:** en el perfil se ve recortada a 3:4 (y 240–1680). El título tiene que caber ahí.
- Las constantes están en `plantilla/src/pro/sistema.ts` (`ZONA`, `ESCENA`, `SUBS`, `SEGURO`, `TXT`). `reel.py revisar … --zonas` las pinta sobre los fotogramas.
- **La cara sube 60 px** respecto al encuadre que calcula `encuadre.py` (`desplazarY`), para dejar 85 px entre la barbilla y la pieza. Con pieza, el zoom se ancla en la barbilla: la cara crece hacia arriba.

## 3. Zonas del lienzo en el modo clásico

| Zona | Altura (px) | Qué va |
|---|---|---|
| Interfaz de Instagram arriba | 0–220 | Nada importante, solo el fondo |
| Etiqueta de capítulo | 236–328, a la izquierda | Logo, número y título |
| Cara | 365–891 | La persona. Aquí no va nada |
| Gráficos | 925–1265 | Una pieza cada vez |
| Subtítulos | 1292–1480 | Dos líneas |
| Interfaz de Instagram abajo | 1560–1920 | Nada importante |
| Botones de la derecha | x > 960, y 1000–1700 | Nada importante |

- **Con una pieza `pantalla`** (grabaciones dobles): la etiqueta sigue arriba a la izquierda, la cara pasa a una burbuja de 224 px arriba a la derecha (y 236–460), la tarjeta con la pantalla ocupa y 474–1264 (960 px de ancho como mucho) y los subtítulos siguen en su sitio.
- **Con `"encuadre": "completo"`** (clips de móvil): el vídeo ocupa todo el lienzo y la cara suele ir de y≈300 a y≈1250: no caben piezas durante los planos de cara. La `portada` va por debajo de la barbilla (y≈1280–1500).
- Las constantes están en `plantilla/src/tema.ts`.

**El encuadre se calcula solo** en los dos modos (`encuadre.py`): detecta la cara con YuNet y escala y coloca el vídeo para que la cabeza empiece en y≈365 y la barbilla acabe en y≈891. Si la grabación es un plano cerrado, eso reduce a la persona y el hueco se rellena prolongando el fondo. `PELO = 0.25` deja margen para peinados con volumen.

## 4. El aspecto del modo pro (marca zonia)

- **Fondo de las escenas:** el del tema, limpio, con un resplandor cálido muy suave arriba. Sin coral en el resplandor.
  Si el estilo elegido lo pide (papel, grano, cuadrícula), su textura va aquí, siempre en los tonos de la marca.
- **Titulares grandes en tipo oración:** el color del texto con la palabra clave en coral (`*así*` en el guion). En las
  escenas, el titular es la pregunta que se hace el espectador.
- **Tarjetas sólidas,** con borde fino y el icono (lineal, en coral) en un cuadrado redondeado. La tarjeta «encendida»
  lleva un velo, el borde y un resplandor de coral.
- **Etiquetas en coral y mayúsculas espaciadas** («LA ZONA», «LO QUE DICEN LOS DATOS»).
- **Pastillas de estado con punto** (coral, verde oliva, trigo, terracota oscura).
- **Piezas que se encienden:** lo que espera va en arena apagada, sin símbolo; al nombrarlo, borde de coral y visto
  bueno verde. Lo que se queda fuera, en terracota oscura con candado.
- **Logo de zonia** siempre arriba a la derecha (icono y «zonia», en su versión para el tema) y **capítulo** arriba a
  la izquierda.
- **La fuente de cada dato,** pequeña (26 px, Geist) y en frase normal («Datos: INE, 2025»), no como rótulo. Si es una
  ilustración, «Ejemplo ilustrativo».

Lo que se mantiene de un reel a otro es este sistema. Lo que cambia: las piezas, las metáforas, los rótulos, el orden
de los planos y el estilo de animación que elija la persona. Qué piezas encajan con cada tema: `marca.md`, apartado 4.

## 5. Subtítulos

- **Modo pro:** una o dos líneas de hasta 18 letras, Nunito 800 en tipo oración de 56 px, siempre en y 1400. La palabra que suena va en coral y da un pequeño salto. En el primer plano sin pieza, 78 px. Se esconden solos mientras una pieza ya es el texto (titular, sentencia, el nombre de un revelado).
- **Modo clásico:** dos líneas de hasta 16 letras, 80 px. Lo que aún no se ha dicho va atenuado y lo dicho, en marfil.
- **En los dos:** una página nunca cruza un corte del vídeo ni termina en una palabra de enlace («de», «la», «y»…).

## 6. Movimiento

Tiempos, curvas y técnicas para que no parezca genérico: `zonia-video/references/movimiento.md`. En Remotion, las piezas están en
`src/componentes/movimiento.tsx` (`Mascara`, `Rodar`, `Iris`, `TrazoVivo`, `Grano`, `curvas`, `banda`, `muelle`, `arco`,
`estela`). Lo que sigue manda para los reels (probado y aprobado):


- **Entradas:** con resortes, de 0,3 a 0,5 s, con un rebote leve en logos e iconos.
- **Salidas:** fundidos cortos, de 0,15 a 0,2 s. La pieza que precede a una escena no se funde: la tapa la cortina.
- **Escenas:** entran como una cortina que sube con un filo de luz y tapa el corte.
- **Encuadre:** un salto en cada corte y un empuje muy lento dentro de cada tramo. Nunca zooms cortos.
- **Al encenderse algo:** un latido pequeño (3–7 %), sin sacudidas.

## 7. Sonido

- **Voz:** normalizada a −14 LUFS, con el pico por debajo de −1,5 dBFS.
- **Modo pro:** un efecto discreto por cada cosa que entra (ticks 12–20 dB por debajo de la voz; golpes, 6–14) y de 4 a 6 golpes graves en todo el reel. Máster con limitador a −1 dB. Biblioteca en `sonidos/` (sintetizados y de Pixabay, sin atribución).
- **Modo clásico:** efectos con cuentagotas, solo en los momentos fuertes.
- **Música:** el reel sale sin música. El usuario la añade en Instagram.

## 8. Marca

`marca.json`, en la raíz del proyecto (lo crea `reel.py preparar` con la marca de zonia). **No se cambia** salvo el
`"tema"` por defecto (`"claro"` u `"oscuro"`), que puede salir del perfil de la persona:

```json
{"nombre": "zonia",
 "tema": "claro",
 "colores": {"fondo": "#1F1A17", "texto": "#F6EBDD", "...": "el modo noche"},
 "colores_claro": {"fondo": "#FBF4E7", "texto": "#3A2A21", "acento": "#DF663F", "...": "el tema claro"},
 "fuente": "Nunito",
 "fuente_texto": "Geist",
 "logo": "logos/zonia-logo-oscuro.svg",
 "logo_claro": "logos/zonia-logo-claro.svg"}
```

- **`colores` y `colores_claro`:** la paleta de cada tema. `acento2` es el acento más oscuro (terracota) y `acento3`,
  el más claro (coral claro); en el tema claro, el texto de acento usa `acento2`, que se lee mejor sobre marfil. Los
  tonos que no salen de aquí (superficies, sombras, el filo de la cortina) están en `S` de `plantilla/src/tema.ts`, y
  los del modo pro, en `D` y `ESTADO` de `plantilla/src/pro/sistema.ts`.
- **Logos de terceros:** `reel.py logos` guarda dos versiones de cada uno (`<slug>.svg` para el tema oscuro y
  `<slug>-claro.svg` para el claro) y `edl` elige la que toca.
- Si cambias `marca.json`, ejecuta `reel.py preparar`.

## 9. Reglas de oficio que se mantienen (no repetir errores)

- **La cara nunca se tapa, ni la frente con la etiqueta ni la barbilla con los gráficos.** Si hace falta, se abre el
  plano en vez de apretar los gráficos.
- **Nada de sellos inclinados.** Para énfasis, texto grande y recto.
- **Referencias de otros creadores:** se analizan para entender el tipo de edición y nunca se copian: ni sus colores,
  ni sus piezas, ni sus rótulos, ni su llamada a la acción. Antes de entregar se compara pieza por pieza.
- **Nada ceñido a la cara:** ni esquinas de visor ni «cara detectada» alrededor de ella.
- **Sin iconos «de IA»** (destellos, varitas): objetos concretos (casa, mapa, calle, termómetro, documento).
- **Nada que parpadee ni zooms cortos de «tambaleo».**
- **Las listas tienen que poder leerse:** completas al menos 2 s, o visibles enteras (apagadas) desde antes.
- **Ritmo sin pausas.** Entre frases, el mínimo silencio posible (una décima); nada de respiros añadidos: un reel
  tiene que ser dinámico para que la gente se quede.
- **Lo que más importa:** que las animaciones vayan integradas con lo que se dice, cada cosa en su palabra. Y que no
  todos los reels sean iguales: la marca se mantiene, las piezas cambian.
- **Doble pantalla:** cuando pidan «doble pantalla», es la pieza `doble` (la persona abajo, la animación arriba).
- **Las piezas de cierre** (pregunta, comenta, acciones) se pueden usar en Instagram y TikTok. Las preguntas nunca son
  cebo: preguntan algo que el espectador puede responder desde su experiencia («¿Qué miras tú antes de mudarte?»).
- **Si la persona rechaza algo de estilo,** apúntalo en su `perfil.md` con el motivo y la fecha; si es de oficio y vale
  para todos, aquí.

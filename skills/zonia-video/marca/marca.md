# Marca zonia en los vídeos (obligatoria)

Esto **no se elige**: todos los vídeos de zonia usan estos colores, estas letras y este logo, sea cual sea el estilo de
animación. Sale de la web (zonia.space) y de la paleta del logo. Si algo de otra skill, plantilla o referencia dice
otra cosa, manda este archivo.

## Colores

### Paleta principal (la del logo y la web)

| Nombre | Hex | Para qué |
|---|---|---|
| Tinta | `#3A2A21` | texto y líneas sobre fondo claro; trazo del logo |
| Terracota oscura | `#9A4020` | sombras; acento como texto pequeño sobre claro |
| Terracota | `#B74B25` | acento sobre fondo claro (se lee mejor que el coral) |
| **Coral teja** | `#DF663F` | **el acento principal**: la palabra clave, la cifra, lo que se enciende |
| Amarillo trigo | `#F7D99C` | toque de luz, con cuentagotas |
| Arena tostada | `#D3B38D` | laterales, elementos secundarios |
| Arena | `#E5C7A3` | bordes, laterales claros |
| Crema | `#F2E4CC` | superficies, tarjetas |
| Marfil | `#FBF4E7` | **fondo claro** |

Extras de la web: coral claro `#F0A07A` (acento sobre fondo oscuro o sobre la grabación), marrón `#6B5345` (texto
secundario), blanco cálido `#FFFDF8` (tarjetas sobre marfil).

### Modo noche (fondo oscuro)

Fondo `#1F1A17`, superficie `#2A2320`, tierra `#3A2F29`, tierra oscura `#4E3E34`, texto `#F6EBDD`, texto suave
`#CDBFB0`. El acento sigue siendo el coral teja (`#F0A07A` para texto pequeño).

### Paleta de película (solo para la grabación)

Los tonos de la paleta «película» (sombra profunda `#13140B`, marrón `#2A2616`, tierra `#423824`, madera `#574B33`,
ocre `#6D6044`, arena `#867559`, piedra dorada `#A08D6E`, beige `#BAA988`, hueso `#D3C9AE`, luz de tarde `#EAE8D4`;
acentos dorado oscuro `#7C5D3A`, dorado claro `#BFA47A` y verde oliva `#5E602C`) son **la referencia para tratar el
color de lo grabado** (`npx hyperframes media-treatment`, o el grado de ffmpeg): que la imagen tire a cálido, terroso y
de luz de tarde. **No se usan** para fondos, textos ni animaciones.

### Reglas de color

- **Un acento por línea:** una sola palabra en coral teja lleva la idea. Si todo es coral, nada lo es.
- **El acento nunca en degradado:** cajas, barras y subrayados de acento, lisos.
- **Fondo claro (marfil) por defecto**, como la web. El modo noche, cuando el vídeo lo pida o para una prueba A/B.
- **Verde oliva, trigo y terracota oscura solo para estados** (sí, aviso, no), nunca de decoración.
- **Nada de azules, morados ni neones.** El azul `#0168FF` y el coral `#FF4747` de una versión anterior de la marca no
  se usan.
- **Contraste:** texto 4,5:1 como mínimo. Coral teja sobre marfil solo en titulares grandes; en texto pequeño, terracota.

## Letras (las de zonia.space)

| Letra | Pesos | Para qué |
|---|---|---|
| **Nunito** | 700, 800, 900 | titulares, rótulos, subtítulos, etiquetas, el nombre «zonia» |
| **Geist** | 400, 500 | texto normal: frases largas, notas, fuentes de los datos |
| **Geist Mono** | 500 | cifras y datos cuando tienen que alinearse (tablas, contadores) |

Los archivos (variables, latín y latín extendido) están en `marca/fuentes/`, con su licencia OFL (libre, también para
uso comercial). Cópialos al proyecto y decláralos con `@font-face`: HyperFrames solo trae Nunito de serie, no Geist.

- Titulares en **tipo oración** («Encuentra la zona que encaja contigo»), con la palabra clave en coral teja. Así lo
  hace la web.
- Mayúsculas solo en etiquetas cortas (rótulos, capítulos, pastillas).
- Tamaño mínimo en vertical: 26 px a 1080×1920 (35 px a 1440×2560).

## Logo

`marca/logo/`:

| Archivo | Cuándo |
|---|---|
| `zonia-icono.svg` | el icono solo (los cubos): esquinas, marcas de agua, avatar |
| `zonia-logo-claro.svg` | icono + «zonia» en tinta, sobre fondo claro |
| `zonia-logo-oscuro.svg` | icono + «zonia» en texto de noche, sobre fondo oscuro |

- **Va siempre que el vídeo lleve marca:** arriba a la derecha en los reels a cámara (lo pone la plantilla) y en el
  cierre de los animados, salvo que la persona diga lo contrario para ese vídeo.
- No se deforma, no se recolorea, no se le añaden sombras ni contornos. Siempre con aire alrededor (al menos la mitad
  de su alto).
- Si hace falta animarlo, los cubos pueden entrar uno a uno (el central, el coral, el último), nunca cambiar de color.

## Textos en pantalla

- Español de España, tildes revisadas, comillas « », cifras «4.000» y «20 %». Sin emojis ni rayas.
- **Cada cifra dice de dónde sale** (como en la web): una nota pequeña en Geist («Datos: INE, 2025»). Ninguna cifra sin
  fuente oficial comprobada; si es ilustrativa, «Ejemplo ilustrativo».
- Nada de cebos («no te lo vas a creer»), ni «deja de hacer scroll».

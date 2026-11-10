"""Pone el tamaño de salida de un proyecto HyperFrames vertical sin tocar las escenas (que siguen hechas a 1080×1920).

python resolucion.py <carpeta del proyecto> entrega|previa|base

- entrega → 1440×2560 (2K): la entrega de los verticales, renderizada directamente (sin pasar por 4K y reducir).
- previa  → 720×1280 (720p): las vistas previas; con `render -q draft` va rápido y pesa poco.
- base    → 1080×1920: el tamaño de trabajo (check, snapshot, revisión de fotogramas).

HyperFrames solo amplía por números enteros (`--resolution portrait-4k`), así que esto cambia el lienzo de index.html
y amplía (o reduce) las escenas con una transformación CSS. El texto y las formas se dibujan a la resolución final,
así que salen nítidos. Después: `npx hyperframes render -q delivery -o ...` (entrega) o `-q draft` (previa), y vuelve
a `base` para seguir trabajando.
"""
import io, os, re, sys

TAM = {"entrega": (1440, 2560), "previa": (720, 1280), "base": (1080, 1920)}
carpeta, modo = sys.argv[1], sys.argv[2]
w, h = TAM[modo]
f = os.path.join(carpeta, "index.html")
s = io.open(f, encoding="utf-8").read()
s = re.sub(r'content="width=\d+, height=\d+"', f'content="width={w}, height={h}"', s)
s = re.sub(r"width: \d+px;(\s*)height: \d+px;", rf"width: {w}px;\g<1>height: {h}px;", s, count=1)
s = re.sub(r'(data-composition-id="main"[^>]*?data-width=")\d+(" data-height=")\d+', rf"\g<1>{w}\g<2>{h}", s)
s = re.sub(r"\n\s*/\* tamaño de salida \*/[^\n]*", "", s)
if modo != "base":
    # 0.9.15 sustituye el nodo con data-composition-src al montar: la regla apunta también a los hijos directos de main
    regla = (f"\n      /* tamaño de salida */ [data-composition-src], [data-composition-id=\"main\"] > [data-composition-id] "
             f"{{ transform: scale({w / 1080:.7f}); transform-origin: 0 0; }}")
    s = s.replace("    </style>", regla + "\n    </style>", 1)
io.open(f, "w", encoding="utf-8").write(s)
print(f"{os.path.basename(os.path.normpath(carpeta))}: lienzo {w}x{h} ({modo})")

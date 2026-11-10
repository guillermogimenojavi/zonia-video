# Marca: lo que afecta a un reel de zonia

Colores, letras y logo son obligatorios y están en `zonia-video/marca/marca.md`: léelo antes de escribir el plan.
Este archivo concreta qué se cuenta y cómo se revisan los textos de pantalla. Precedencia: lo que diga la persona para
ese vídeo > este archivo > las guías generales.

## 1. Qué es zonia y a quién habla

- zonia (zonia.space) enseña cómo es una zona de España, calle a calle y con datos oficiales: seguridad, clima,
  servicios, riesgos naturales y más, comparada con su municipio y con España. Ayuda a encontrar «la zona que encaja
  contigo».
- Habla a quien va a mudarse, alquilar o comprar, o simplemente quiere conocer su barrio. Tono cercano, claro y sin
  alarmismo.
- Su promesa es la transparencia: **cada cifra dice de dónde sale.**

## 2. Qué se cuenta y cómo

- **Datos oficiales y con fuente.** Toda cifra en pantalla lleva su pie pequeño («Datos: INE, 2025») y se comprueba en
  la fuente antes de ponerla. Si es una comparación, en dos fuentes. Si es una ilustración, «Ejemplo ilustrativo» y sin
  cifras que parezcan reales.
- **Sin alarmismo.** Riesgos naturales, seguridad o ruido se cuentan como información para decidir, nunca como miedo.
  Ningún barrio se ridiculiza ni se señala como «malo»: se dice qué datos tiene.
- **Nada de datos personales** ni direcciones de particulares.
- **Mapas y capturas reales** mejor que maquetas: la web de zonia (`reel.py captura <reel> https://www.zonia.space/...`),
  el mapa real de la zona de la que se habla.

## 3. Lista de revisión de textos en pantalla

**Bloquea la entrega** (avisa y no lo pongas):
- una cifra sin fuente oficial comprobada, o un dato inventado;
- un barrio o un municipio presentado como «peligroso» o «malo» sin el dato que lo respalda;
- datos personales o direcciones de particulares;
- colores fuera de la paleta, otra letra que no sea Nunito, Geist o Geist Mono, o el logo deformado o recoloreado.

**Corregir antes de montar:** más de un contraste «no X, sino Y»; marcas de texto de IA (`zonia-guion`,
`references/humanizar.md`); anglicismo con equivalente en español; más de una palabra en coral por línea.

**Pulir:** tildes, comillas « », formato de cifras («4.000», «20 %»), tipo oración en titulares y mayúsculas solo en
etiquetas.

## 4. Qué piezas encajan con los temas de zonia

| Tema | Piezas del catálogo | Pieza propia que suele pedir |
|---|---|---|
| Comparar dos zonas | `columnas`, `cambio` | dos fichas de zona enfrentadas, con el dato que cambia en coral |
| Un dato de una zona (clima, ruido, servicios) | `sentencia`, `campo`, `escena` con `filas` | el mapa de la zona con la capa que se enciende |
| Cómo usar la web | `escena` con `ventana` (captura real) | el buscador que se escribe y el mapa que se acerca |
| Riesgos naturales | `escena` con `flujo`, `lista` | la calle con la zona de riesgo dibujándose |
| Lo que nadie mira antes de mudarse | `lista`, `doble` con `escalera` | una lista de comprobación que se va marcando |

El isométrico del logo (cubos) es un buen recurso propio: una zona como un bloque de cubos en el que se enciende el
cubo coral.

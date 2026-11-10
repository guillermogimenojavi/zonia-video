# Movimiento con criterio (para que no parezca genérico)

Vale para los dos motores: los reels a cámara (`zonia-reels`, Remotion) y los animados (`zonia-animado`,
HyperFrames), **sea cual sea el estilo de animación** que haya elegido la persona (`estilos/estilos.md`): el estilo
cambia cómo se dibujan las cosas; estos tiempos, curvas y reglas de ritmo no cambian. Sale del kit `claude-motion`
(MIT). Colores y letras, siempre los de `marca/marca.md`. Los números son valores de partida: sepárate de ellos a
propósito, nunca por descuido. Léelo entero antes de escribir escenas.

## 1. Lo que hace que una animación parezca genérica

- Todo entra a la vez, o todo dura lo mismo.
- Curva lineal en algo que arranca o se para.
- Texto que se mueve mientras hay que leerlo.
- Dos focos de atención en el mismo fotograma.
- Transiciones de catálogo (barrido, fundido) que no salen de nada que esté en pantalla.
- Objetos que desaparecen en una escena y otros nuevos que aparecen en la siguiente.
- Un fondo muerto: ni grano, ni deriva, ni luz que cambie.
- El fotograma 0 vacío (es la miniatura).

## 2. Tiempos

| Qué | Valor |
|---|---|
| Entre palabras de un titular | 0,09 s |
| Entre elementos de una lista o chips | 0,2–0,25 s |
| Entre puntos, anillos o nodos | 0,06 s |
| Revelado de una palabra con máscara | 0,8 s |
| Entrada | 0,7–1,25 s (piezas grandes); 0,4–0,6 s (chips, iconos) |
| **Salida** | **la mitad de su entrada** (0,35–0,55 s), con curva de salida |
| Escribir a máquina | 0,035 s por carácter; cursor a 2,4 Hz cuando espera |
| **Tiempo de lectura** | lo que se lee se queda **quieto**: 1 s para una frase corta + 0,25 s por palabra a partir de la tercera; 2 s el remate final |

- Las escenas se **solapan**: la siguiente empieza a dibujarse antes de que la anterior termine de irse. Un hueco vacío
  se lee como «cargando».
- Ante la duda, más tiempo quieto y menos animación (el kit tuvo que pasar de 15 a 22 s porque el texto pasaba rápido).

## 3. Curvas

| Curva | Para | Remotion | GSAP (HyperFrames) |
|---|---|---|---|
| Entrada: bezier(0.16, 1, 0.3, 1) | todo lo que llega | `curvas.entrada` | `"expo.out"` |
| Salida: bezier(0.6, 0, 0.9, 0.35) | lo que se va, rápido | `curvas.salida` | `"power3.in"` |
| De un estado a otro: bezier(0.65, 0, 0.35, 1) | voltear, acoplarse, transformarse | `curvas.cambio` | `"power3.inOut"` |
| Aterrizaje: bezier(0.55, 0, 0.2, 1.12) | un valor que llega y se asienta (una barra, un nivel) | `curvas.llega` | `"back.out(1.2)"` |

Lineal, solo para movimiento continuo (deriva, giro, grano, agujas de reloj).

**Resortes** (lo físico: tarjetas, objetos; las curvas, para texto y cámara): asentar 14/140/0,8 (amortiguación/rigidez/masa),
pesado 15–20/140–240, encaje de un mando 12/190/0,75, salto de una insignia 9–11/200–230/0,7, y el elástico 8/200
**solo en el momento fuerte**.

## 4. Las técnicas (y dónde está cada una)

| Técnica | Qué hace | Remotion | HyperFrames |
|---|---|---|---|
| **Revelado con máscara** | la palabra sube desde dentro de su renglón con una leve inclinación (5°) y se va hacia arriba | `<Mascara>` | `revelar()` |
| **Cifra que rueda** | un valor sale por arriba y entra el siguiente por abajo | `<Rodar>` | `rodar()` |
| **Derivar de un estado** | una animación no lleva reloj propio: sale de otro valor (los rótulos cambian según dónde está la barra; la luz, según lo contrastado que está algo) | `banda()` | `banda()` |
| **Estela por velocidad** | lo que se mueve rápido deja copias y se estira según su velocidad | `estela()` | `estela()` |
| **Objeto que viaja** | la misma pieza cruza escenas y cambia de papel, por un arco | `arco()` | `arco()` |
| **Transición motivada (iris)** | varias piezas se juntan en una, que crece y abre la escena siguiente | `<Iris>` | `iris()` |
| **Trazo vivo** | las líneas tiemblan como dibujadas a mano y se quedan nítidas cuando la idea se aclara | `<TrazoVivo>` | `trazoVivo()` |
| **Grano que respira** | grano de película que cambia cada dos fotogramas | `<Grano>` | `grano()` |

Código: Remotion en `zonia-reels/plantilla/src/componentes/movimiento.tsx`; HyperFrames en
`zonia-animado/plantilla/movimiento.js`.

## 5. Cómo encajan con zonia (úsalas así antes que en abstracto)

- **El cubo que viaja:** el cubo coral del logo (o un punto del mapa) cruza el vídeo y cambia de papel: marca una
  calle en el gancho y es el que se enciende en el cierre. Mejor que cortar a una escena nueva.
- **Rodar:** cifras que cambian al comparar zonas («12 min» → «4 min» al colegio), precios, distancias.
- **Derivar de un estado:** el color de una zona del mapa sale del dato (más coral cuanto más alto), no del reloj.
- **Iris motivado:** varias calles o zonas se juntan en una, que se abre como la escena siguiente.
- **Trazo vivo:** un barrio que «crees conocer» tiembla y se queda nítido cuando salen los datos oficiales.
- **Estela:** algo que sube o baja demasiado rápido (un precio, un riesgo).

## 6. Composición, color y textura

- **Un foco por fotograma.** Si dos cosas compiten, una espera.
- **Un acento por línea**: una sola palabra en coral teja lleva la idea. Si todo es coral, nada lo es.
- **Margen de seguridad**: nada importante a menos de 60 px del borde (en verticales, la zona segura de cada skill).
- **Nada del todo quieto**: grano (0,06–0,09 en modo noche; 0,04 en marfil), cuadrícula de puntos que deriva unos px/s,
  viñeta suave, y lo que espera respira (un cursor, una aguja, un giro lento).
- **Un momento fuerte por vídeo** (el iris, el remate, la cifra clave): se construye hacia él y no se gasta antes. El
  rebote elástico y el golpe de sonido grande, solo ahí.
- **Prueba del móvil**: con la miniatura a 360 px de ancho, la idea clave se lee.

## 7. Revisión (además de la de cada skill)

Con la hoja de fotogramas de cada momento clave (0,3 s después de cada uno, cuando ya se ha asentado):
- ¿Algún texto sigue moviéndose a mitad de su tiempo de lectura? Falta tiempo quieto.
- ¿Hay fotogramas vacíos entre escenas? Solápalas.
- ¿Las salidas son más rápidas que las entradas?
- ¿Algo choca o se tapa en una transición (lo que sale y lo que entra comparten sitio)?
- ¿Hay más de un foco? ¿Más de un acento coral por línea?
- ¿El fotograma 0 tiene contenido?
- ¿El momento fuerte llega una sola vez y bien construido?
Para una transición dudosa, fotogramas cada 0,2 s dentro de ella. No digas que algo está arreglado sin volver a
renderizarlo y mirarlo.

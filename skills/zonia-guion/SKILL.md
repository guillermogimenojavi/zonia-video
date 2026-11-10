---
name: zonia-guion
description: "Guion y gancho de un reel de zonia antes de grabar (ganchos puntuados, duración medida, pausas marcadas) y quitar a un texto el aire de IA. Úsala al pedir «escríbeme el guion», «qué gancho pongo» o «suena a IA»."
---

# Guion y gancho (zonia)

Lo que más decide si un vídeo corto se ve hasta el final se escribe antes de grabar: el gancho de los primeros 2 s, una
idea por golpe y nada de relleno. Esta skill hace eso con scripts que miden, no a ojo. Habla en español y sin jerga.

| Tarea | Guía | Script |
|---|---|---|
| Guion, gancho, rótulos y ficha para editar | `references/guion.md` | `hookscore.py`, `beats.py` |
| Quitar el aire de IA a cualquier texto | `references/humanizar.md` | `humanize.py`, `detect.py` |

Los scripts están en `<skill>/scripts/` (`python <skill>/scripts/x.py`) y leen `<skill>/datos/` (26 fórmulas de
gancho con ejemplos de zonia, y el léxico que suena a IA).

## Reglas de siempre

- **Nada se publica ni se envía por tu cuenta.** Tú redactas; la persona decide.
- **Nunca inventes** cifras, casos ni citas: `[DATO PENDIENTE]`. Como en la web de zonia, cada cifra dice de dónde sale.
- Español de España, comillas « », sin emojis, sin rayas, sin «deja de hacer scroll» ni cebos. Como mucho un
  «no X, sino Y» por pieza.
- Todo texto pasa por `humanize.py` y `detect.py` antes de enseñarlo.
- La voz, como mucho a 1,1x. El ritmo se gana con las pausas del guion, no acelerando.

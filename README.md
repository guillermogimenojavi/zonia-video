# zonia-video

Skills de Claude Code para hacer los vídeos de zonia (zonia.space) con Claude: del guion al reel vertical listo para
publicar. Funcionan en Windows y en Mac.

- **La marca es fija:** colores, letras (Nunito, Geist y Geist Mono) y logo de zonia, iguales en todos los vídeos.
- **El estilo de animación lo elige cada persona:** hay un menú de 15 estilos con muestras, y cada uno guarda el suyo
  en su perfil. Se puede cambiar en cada vídeo.
- **El ritmo, los cortes y los ganchos son los mismos para todos:** pausas medidas, un cambio en pantalla cada 1-2 s,
  gancho desde el primer fotograma y una revisión de retención antes de publicar.

## Qué incluye

| Skill | Para qué |
|---|---|
| `zonia-video` | La entrada: prepara el equipo y la carpeta de trabajo, el perfil de cada persona, el menú de estilos, las reglas de ritmo y la revisión de retención. Lleva la marca (`marca/`) y las muestras de estilos (`estilos/`). |
| `zonia-guion` | Guion y gancho antes de grabar: 26 fórmulas de gancho puntuadas, duración medida y texto sin aire de IA. |
| `zonia-reels` | Reels verticales hablando a cámara (Remotion): quita pausas y tomas, sincroniza cada animación con la voz y pone subtítulos, sonidos y portada. |
| `zonia-animado` | Vídeos solo de animación, sin cámara, y piezas sueltas (HyperFrames). |
| `zonia-autocorreccion` | Cuando algo falla, arregla la skill para que no vuelva a pasar. |

## Instalar

Necesitas [Claude Code](https://claude.com/claude-code) y Node.js 22 o más.

1. Instala las skills (en una terminal):

   ```bash
   npx skills add <usuario-de-github>/zonia-video -g -a claude-code -s '*' -y --copy
   ```

2. Abre Claude Code y escribe: **«prepara mi equipo para hacer vídeos de zonia»**. Claude comprueba e instala lo que
   falte (FFmpeg, Git, Python, HyperFrames y la transcripción en español), crea tu carpeta de trabajo (`C:\zonia\` en
   Windows, `~/zonia/` en Mac) y te pregunta tu estilo de animación. Si algo necesita tu contraseña o un permiso, te
   dice el comando exacto para que lo ejecutes tú.

3. A partir de ahí, abre Claude Code en tu carpeta de trabajo y di **«vídeo nuevo»**, **«escríbeme el guion de…»** o
   **«sigue con <vídeo>»**.

## Actualizar

Al preparar el equipo, Claude añade una regla que **actualiza las skills sola cada vez que se abre Claude Code**. Para
hacerlo a mano:

```bash
npx skills update -g -y
```

## Aportar mejoras

Cualquiera con permiso de escritura en este repositorio puede mejorar las skills:

1. Clona el repositorio en tu carpeta de trabajo (`C:\zonia\zonia-video` o `~/zonia/zonia-video`).
2. Pídele a Claude el cambio ahí (no en `~/.claude/skills`, que se sobrescribe al actualizar). Cuando algo falla,
   `zonia-autocorreccion` ya lo hace así.
3. Claude crea una rama, sube el cambio y abre un *pull request* (con tu permiso).
4. Quien mantiene el repositorio lo revisa y lo acepta. La próxima vez que abran Claude Code, lo tiene todo el equipo sin hacer nada.

Qué se puede cambiar y qué no:
- **Sí:** reglas de oficio, arreglos de scripts, piezas nuevas, estilos nuevos en el menú, fórmulas de gancho.
- **Con acuerdo del equipo:** el ritmo (`skills/zonia-video/references/ritmo.md`) y los umbrales de retención.
- **No:** la marca (`skills/zonia-video/marca/`). Los gustos personales van en el `perfil.md` de cada uno, no aquí.

## Cómo se trabaja

1. **Guion** (`zonia-guion`): tres ganchos puntuados, el guion medido en segundos y las pausas marcadas.
2. **Grabación:** la dejas en `brutos/`.
3. **Vídeo nuevo** (`zonia-video`): eliges el estilo de animación (o el de siempre) y Claude edita con `zonia-reels` o
   `zonia-animado`.
4. **Vista previa a 720p:** la revisas y pides cambios.
5. **Revisión de retención** y **entrega en 2K** (1440×2560) en `finales/`.

## Licencias

- Letras: Nunito y Geist, con licencia SIL Open Font License (`skills/zonia-video/marca/fuentes/OFL-*.txt`).
- Sonidos: sintetizados y de Pixabay, sin atribución (`skills/zonia-reels/sonidos/CREDITOS.md`).
- Piezas de movimiento basadas en `claude-motion` (MIT). Fórmulas de gancho y detector de texto de IA adaptados de
  `instagram-agent-skill` (MIT).
- El logo y la marca de zonia son de zonia: solo para los vídeos de zonia.

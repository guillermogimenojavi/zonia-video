# Preparar el equipo (solo la primera vez)

1. **Herramientas.** Comprueba Node.js 22 o más, FFmpeg, Git y Python 3.10 o más. Lo que falte:
   - Windows: `winget install OpenJS.NodeJS.LTS Gyan.FFmpeg Git.Git Python.Python.3.12`.
   - Mac: `brew install node ffmpeg git python@3.12` (si no hay Homebrew, dile que lo instale desde brew.sh: pide su
     contraseña y tiene que hacerlo él).
2. **HyperFrames:** `npx skills add heygen-com/hyperframes -g -a claude-code -s '*' -y` y `npx hyperframes doctor`.
3. **Transcripción en español (whisper.cpp)**, necesaria para los subtítulos y para sincronizar con la voz:
   - Mac: `brew install whisper-cpp`.
   - Windows: el binario oficial `whisper-bin-x64.zip` de github.com/ggml-org/whisper.cpp/releases, descomprimido en
     `%LOCALAPPDATA%\Programs\whisper-cpp\`, y la variable de usuario `HYPERFRAMES_WHISPER_PATH` apuntando a su
     `Release\whisper-cli.exe`. Si el sistema de permisos no te deja ejecutar el binario descargado, dale a la persona
     el comando exacto para que lo ejecute ella.
   - Comprueba con un audio corto en español: `npx hyperframes transcribe <audio> --engine whisper --model small
     --language es` tiene que dar cada palabra con su tiempo.
   - Si `doctor` no encuentra Python o sus paquetes aunque estén, puede haber dos Python: pon la variable
     `HYPERFRAMES_PYTHON` con la ruta del bueno.
4. **Carpeta de trabajo:** créala con `brutos/`, `recursos/`, `finales/` y `animados/`, y copia ahí
   `<skill>/plantillas/CLAUDE.md`, `<skill>/plantillas/perfil.md`, un `proyectos.md` vacío (tabla: vídeo, formato,
   estilo, estado) y un `aprendizajes.md` vacío.
5. **Perfil:** pregúntale su nombre y qué ordenador usa, y enséñale el menú de estilos (`estilos/estilos.md`, apartado
   «Cómo se ofrece») para elegir el de por defecto y el tema (claro o noche). Rellena `perfil.md`.
6. **Reels a cámara** (si los va a hacer): desde `<carpeta de trabajo>/reels`, `python <zonia-reels>/scripts/reel.py
   entorno --instalar` y `reel.py preparar` (ver `zonia-reels`).
7. **GitHub** (el repositorio es privado): comprueba `gh auth status`. Si no hay sesión, instala GitHub CLI (Windows:
   `winget install GitHub.cli`; Mac: `brew install gh`), lanza `gh auth login --hostname github.com --git-protocol
   https --web` en segundo plano, ábrele `https://github.com/login/device` para que inicie sesión él y escribe el
   código de un solo uso que imprime. Después, `gh auth setup-git` (sin esto, la actualización no entra en el
   repositorio privado).
8. **Actualización automática:** añade a `~/.claude/settings.json` (créalo si no existe; si ya tiene `hooks`, súmalo
   sin borrar lo que haya) esta regla, que al abrir Claude Code baja en silencio la última versión de las skills:

   ```json
   {"hooks": {"SessionStart": [{"hooks": [{"type": "command",
     "command": "npx -y skills update -g -y >/dev/null 2>&1 || true", "timeout": 90}]}]}}
   ```

   La salida va a `/dev/null` a propósito: lo que imprime un hook de arranque entra en la conversación y gasta
   tokens. Para comprobarlo, `npx skills update -g -y` a mano debe decir que está al día.
9. **Si va a aportar mejoras** (tiene permiso de escritura en el repositorio): `git clone
   https://github.com/guillermogimenojavi/zonia-video.git` en `<carpeta de trabajo>/zonia-video`. Las mejoras se hacen ahí, no
   en la copia instalada en `~/.claude/skills` (la actualización la sobrescribe). Ver «Aportar mejoras» en el
   `README.md` del repositorio.
10. Dile que abra Claude Code en su carpeta de trabajo a partir de ahora.

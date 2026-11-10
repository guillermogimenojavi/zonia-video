"""Revisión de retención de un vídeo vertical antes de publicar (references/revision-retencion.md).

Uso:
    python retencion.py <video.mp4> [--transcripcion <json>] [--voz <audio de la voz sola>] [--marcados 12.4,30.1]
                        [--eventos 3.2,5.6,...] [--loudness -14] [--escena 0.08] [--informe <salida.md>]

Mide con ffmpeg/ffprobe las comprobaciones que se pueden medir sin mirar la imagen (1, 3, 4, 5, 6, 8, 9, 14, 15 y las
del apartado B) y deja las que piden mirar fotogramas (2, 7, 10, 11, 12, 13) como «REVISAR»: se comprueban con el
`revisar`/`snapshot` de la skill del formato y se rellenan a mano. Nunca inventa un valor: lo que no puede medir sale
como SIN DATO con el motivo.

- `--transcripcion`: palabras con tiempos. Vale la de cualquier skill: lista o {"palabras": [...]}, con claves
  w/word/text y s/start, e/end (reels `alineacion/tiempos.json` o `transcripcion_base.json`, horizontal
  `edicion/tiempos.json`, HyperFrames `transcript.json`). Sin ella, la primera palabra sale del primer silencio y no hay
  apartado B de habla.
- `--voz`: el audio de la voz sola. Los silencios se miden mejor en él: con música de fondo, `silencedetect` no los ve.
- `--marcados`: inicios (s) de los silencios marcados con (S) en el guion, para la comprobación 4.
- `--eventos`: instantes (s) en que entra algo en pantalla (piezas, textos, cortes del montaje), de la tabla de sincronía
  de la skill. La detección de cortes de ffmpeg no ve las piezas que entran poco a poco ni los saltos entre planos de la
  misma pared: sin `--eventos`, los tramos largos de la comprobación 6 salen como REVISAR, no como FALLA.
"""
import argparse
import json
import os
import re
import subprocess
import sys

UMBRAL_DB = -35


def ffprobe(video):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                          "format=duration:stream=codec_type,width,height,avg_frame_rate,sample_aspect_ratio",
                          "-of", "json", video], capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    num, den = (v.get("avg_frame_rate") or "0/1").split("/")
    fps = float(num) / float(den or 1) if float(den or 1) else 0
    return float(d["format"]["duration"]), v["width"], v["height"], fps


def ffmpeg_log(args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args, "-f", "null", "-"],
                          capture_output=True, text=True).stderr


def silencios(audio, minimo=0.3):
    log = ffmpeg_log(["-i", audio, "-vn", "-af", f"silencedetect=noise={UMBRAL_DB}dB:d={minimo}"])
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    fin = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    return list(zip(ini, fin + [None] * (len(ini) - len(fin))))


def cortes(video, umbral):
    log = ffmpeg_log(["-i", video, "-an", "-vf", f"scale=270:480,select='gt(scene,{umbral})',showinfo"])
    return [float(x) for x in re.findall(r"pts_time:([\d.]+)", log)]


def sonoridad(audio):
    log = ffmpeg_log(["-i", audio, "-vn", "-af", "ebur128=peak=true"])
    resumen = log[log.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", resumen)
    tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", resumen)
    return (float(i.group(1)) if i else None), (float(tp.group(1)) if tp else None)


def diferencia_extremos(video, dur):
    """Diferencia media (0–255) entre el primer y el último fotograma, en gris y pequeño."""
    def fotograma(t):
        return subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(t, 0):.3f}", "-i", video, "-frames:v", "1",
                               "-vf", "scale=54:96,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    a, b = fotograma(0), fotograma(dur - 0.1)
    if not a or len(a) != len(b):
        return None
    return sum(abs(x - y) for x, y in zip(a, b)) / len(a)


def palabras(ruta):
    d = json.load(open(ruta, encoding="utf-8"))
    if isinstance(d, dict):
        d = d.get("palabras") or d.get("words") or []
    out = []
    for w in d:
        t = w.get("w") or w.get("word") or w.get("text") or ""
        s = w.get("s", w.get("start"))
        e = w.get("e", w.get("end", s))
        if s is not None:
            out.append((str(t).strip(), float(s), float(e)))
    return out


def estado(valor, ok, aviso):
    """ok/aviso: funciones valor → bool. Devuelve OK, AVISO o FALLA."""
    return "OK" if ok(valor) else ("AVISO" if aviso(valor) else "FALLA")


def main():
    for st in (sys.stdout, sys.stderr):
        try:
            st.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError, OSError):
            pass
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--transcripcion")
    ap.add_argument("--voz")
    ap.add_argument("--marcados", default="")
    ap.add_argument("--loudness", type=float, default=-14.0, help="sonoridad del resto de vídeos (LUFS)")
    ap.add_argument("--eventos", default="", help="instantes en que entra algo en pantalla, separados por comas")
    ap.add_argument("--escena", type=float, default=0.08, help="umbral de cambio de escena (sobre la imagen reducida)")
    ap.add_argument("--informe")
    a = ap.parse_args()

    dur, w, h, fps = ffprobe(a.video)
    audio = a.voz or a.video
    sil = silencios(audio)
    ws = palabras(a.transcripcion) if a.transcripcion else []
    if a.transcripcion and not ws:
        sys.exit(f"{a.transcripcion} no tiene palabras con tiempos (¿es el guion en vez de la transcripción?)")
    filas = []  # (n, comprobación, valor, estado, arreglo)

    # 1 · primera palabra (con música de fondo, silencedetect sobre la mezcla no sabe dónde empieza la voz)
    arreglo1 = "Recorta el principio hasta la primera sílaba (o `--congelar-inicio` si es un parpadeo)."
    if ws or a.voz:
        if ws:
            t1, fuente = ws[0][1], "transcripción"
        else:
            t1, fuente = (sil[0][1] if sil and sil[0][0] < 0.05 and sil[0][1] else 0.0), "voz sola"
        filas.append((1, "Primera palabra", f"{t1:.2f} s ({fuente})", estado(t1, lambda v: v <= 0.3, lambda v: v <= 0.6), arreglo1))
    else:
        filas.append((1, "Primera palabra", "SIN DATO (con la mezcla no se distingue la voz: pasa --transcripcion o --voz)",
                      "SIN DATO", arreglo1))

    # 2 · texto al empezar (mirar fotograma 0)
    filas.append((2, "Texto en pantalla al empezar", "mirar el fotograma 0", "REVISAR",
                  "El gancho escrito tiene que estar completo en el primer fotograma."))

    # 3 · primera frase del gancho
    if ws:
        fin = next((e for t, s, e in ws if t.endswith((".", "?", "!", "…"))), None)
        if fin is None:
            filas.append((3, "Primera frase del gancho", "SIN DATO (la transcripción no tiene puntuación)", "SIN DATO",
                          "Pasa la alineación con el guion puntuado."))
        else:
            filas.append((3, "Primera frase del gancho", f"acaba en {fin:.2f} s", estado(fin, lambda v: v <= 3.5, lambda v: v <= 4.5),
                          "Acorta la primera frase o empieza más tarde en el guion."))
    else:
        filas.append((3, "Primera frase del gancho", "SIN DATO (falta --transcripcion)", "SIN DATO", "Pasa la transcripción."))

    # 4 y 5 · silencios (sin contar el principio ni el final)
    fin_voz = ws[-1][2] if ws else dur - 3.0  # el cierre con el logo no cuenta como silencio
    interiores = [(s, e, e - s) for s, e in sil if e and s > 0.05 and s < fin_voz]
    marcados = [float(x) for x in a.marcados.split(",") if x.strip()]
    if marcados:
        peor, filas4 = 0.0, []
        for m in marcados:
            d = max((L for s, e, L in interiores if abs(s - m) < 0.4), default=0.0)
            peor = max(peor, d)
        filas.append((4, "Silencios marcados (S)", f"el más largo, {peor:.2f} s",
                      "OK" if 0.4 <= peor <= 0.5 or peor == 0 else ("AVISO" if peor <= 0.7 else "FALLA"),
                      "Ajusta cada (S) a 0,4–0,5 s."))
    else:
        filas.append((4, "Silencios marcados (S)", "SIN DATO (sin --marcados)", "SIN DATO", "Pasa los inicios de los (S) del guion."))
    sin_marcar = [x for x in interiores if not any(abs(x[0] - m) < 0.4 for m in marcados)]
    largos = [x for x in sin_marcar if x[2] > 0.5]
    medios = [x for x in sin_marcar if 0.3 < x[2] <= 0.5]
    nota = "" if a.voz else " · medido con la mezcla: con música puede no verlos (usa --voz)"
    val5 = f"{len(largos)} de >0,5 s, {len(medios)} de 0,3–0,5 s" + ("".join(f" · {s:.1f}s" for s, e, L in largos[:5])) + nota
    filas.append((5, "Silencios sin marcar", val5, "FALLA" if largos else ("AVISO" if medios else "OK"),
                  "Quita los silencios de la lista (corta el tramo o mete algo que cambie en pantalla)."))

    # 6 · cambio visual
    cs = cortes(a.video, a.escena)
    eventos = [float(x) for x in a.eventos.split(",") if x.strip()]
    marcas = sorted(set([0.0] + cs + eventos + [dur]))
    huecos = [(marcas[k], marcas[k + 1] - marcas[k]) for k in range(len(marcas) - 1)]
    t_peor, peor = max(huecos, key=lambda x: x[1])
    largos6 = [f"{t:.1f}–{t + L:.1f} s" for t, L in huecos if L > 2.5][:6]
    arreglo6 = "Si en ese tramo no entra ningún texto ni pieza, añade un cambio (pieza, corte de encuadre o primer plano)."
    if eventos:
        filas.append((6, "Cambio visual", f"tramo más largo sin cambio: {peor:.1f} s (desde {t_peor:.1f} s)",
                      estado(peor, lambda v: v <= 2.5, lambda v: v <= 4.0), arreglo6))
    else:
        filas.append((6, "Cambio visual", f"solo cortes detectados ({len(cs)}); tramos de más de 2,5 s por mirar: "
                      + (", ".join(largos6) or "ninguno") + " · pasa --eventos con la tabla de sincronía",
                      "REVISAR" if largos6 else "OK", arreglo6))

    # 7 · imagen durante los silencios
    filas.append((7, "Imagen durante los silencios", "mirar los fotogramas de cada (S)", "REVISAR",
                  "Durante cada (S) algo tiene que cambiar o aparecer."))

    # 8 · duración
    filas.append((8, "Duración total", f"{dur:.1f} s", estado(dur, lambda v: 30 <= v <= 55, lambda v: v <= 60),
                  "Recorta hasta 30–55 s para Reels, TikTok y Shorts."))

    # 9 · formato
    ok9 = (w, h) in ((720, 1280), (1080, 1920), (1440, 2560)) and fps >= 29.9
    filas.append((9, "Formato", f"{w}×{h}, {fps:.2f} fps", "OK" if ok9 else "FALLA", "Vista previa a 720×1280 (o 1080×1920); entrega a 1440×2560; 30 fps o más."))

    # 10–13 · mirando fotogramas
    filas.append((10, "Subtítulos", "mirar fotogramas contra la tabla de sincronía de la skill", "REVISAR",
                  "Incrustados y con desfase de 0,15 s o menos."))
    filas.append((11, "Zona segura", "mirar fotogramas con las zonas pintadas (`revisar --zonas`)", "REVISAR",
                  "Nada clave en los 250 px de arriba ni de abajo ni pegado a la derecha."))
    filas.append((12, "Legibilidad del texto", "contraste texto / fondo de la paleta", "REVISAR",
                  "Tinta sobre marfil pasa de sobra; cuidado con el coral sobre fotografía y en texto pequeño."))
    filas.append((13, "Recorte de la portada", "mirar la portada en 3:4 y 4:5", "REVISAR", "El título tiene que caber en el recorte central."))

    # 14 · sonido
    lufs, tp = sonoridad(a.video)
    if lufs is None:
        filas.append((14, "Sonido", "SIN DATO (ebur128 no dio resultado)", "SIN DATO", "Comprueba que el vídeo tiene audio."))
    else:
        dif = abs(lufs - a.loudness)
        e14 = "FALLA" if (tp is not None and tp > -1.0) or dif > 2 else ("OK" if dif <= 0.5 else "AVISO")
        filas.append((14, "Sonido", f"{lufs:.1f} LUFS (objetivo {a.loudness:g}), pico {tp if tp is not None else '?'} dBTP", e14,
                      "Normaliza la voz a −14 LUFS con el pico por debajo de −1 dBTP."))

    # 15 · final y comienzo
    dif15 = diferencia_extremos(a.video, dur)
    if dif15 is None:
        filas.append((15, "Final y comienzo", "SIN DATO (no se pudieron leer los fotogramas)", "SIN DATO", ""))
    else:
        filas.append((15, "Final y comienzo", f"diferencia media {dif15:.0f}/255 entre el primer y el último fotograma",
                      "OK" if dif15 < 25 else "AVISO", "Si el final se parece al principio, se favorece que se vuelva a ver."))

    # B · para comparar
    b = []
    if ws:
        hab = max(ws[-1][2] - ws[0][1], 0.01)
        b.append(f"- Velocidad del habla: {len(ws) / hab * 60:.0f} palabras por minuto")
        fin_g = next((e for t, s, e in ws if t.endswith((".", "?", "!", "…"))), None)
        if fin_g:
            g = [x for x in ws if x[1] < fin_g]
            b.append(f"- Velocidad en el gancho: {len(g) / max(fin_g - ws[0][1], 0.01) * 60:.0f} palabras por minuto")
        b.append(f"- Palabras en los primeros 3 s: {sum(1 for t, s, e in ws if s < 3)}")
    else:
        b.append("- Velocidad del habla y palabras del gancho: SIN DATO (falta --transcripcion)")
    b.append(f"- Cortes de imagen por cada 10 s: {len(cs) / dur * 10:.1f}")
    b.append("- Proporción del tiempo con texto en pantalla: SIN DATO (se estima mirando los fotogramas)")

    fallas = [f for f in filas if f[3] == "FALLA"]
    avisos = [f for f in filas if f[3] == "AVISO"]
    revisar = [f for f in filas if f[3] in ("REVISAR", "SIN DATO")]
    veredicto = ("**FALLA**: no se exporta la versión final sin el visto bueno de quien hace el vídeo." if fallas else
                 "**Sin fallas** en lo medido." + (" Hay avisos (no bloquean)." if avisos else "")) + \
                (f" Quedan {len(revisar)} comprobaciones por mirar a mano." if revisar else "")

    lineas = [f"# Revisión de retención · {os.path.basename(a.video)}", "",
              "| # | Comprobación | Valor medido | Estado | Cómo arreglarlo |", "|---|---|---|---|---|"]
    lineas += [f"| {n} | {c} | {v} | {e} | {arr} |" for n, c, v, e, arr in filas]
    lineas += ["", "## Para comparar (no bloquea)", "", *b, "", f"**Veredicto:** {veredicto}"]
    texto = "\n".join(lineas) + "\n"
    print(texto)
    if a.informe:
        open(a.informe, "w", encoding="utf-8").write(texto)


if __name__ == "__main__":
    main()

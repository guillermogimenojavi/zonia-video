/* Piezas de movimiento para HyperFrames (de claude-motion, MIT, adaptadas a zonia).
   Cuándo usar cada una y con qué tiempos: zonia-video/references/movimiento.md.
   Copia este archivo a assets/movimiento.js del proyecto y cárgalo con <script src="assets/movimiento.js"></script>
   después de GSAP. Todo va dentro de la línea de tiempo pausada de la escena: se puede saltar a cualquier instante.

   Curvas GSAP equivalentes: entrada "expo.out" · salida "power3.in" · de un estado a otro "power3.inOut" ·
   aterrizaje "back.out(1.2)". */
(function (root) {
  "use strict";
  const lerp = (a, b, k) => a + (b - a) * k;
  const clamp01 = (x) => Math.min(1, Math.max(0, x));

  /* banda(x, a, b): 0..1 suave cuando x pasa de a a b (derivar una animación de otro valor) */
  const banda = (x, a, b) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };

  /* Revelado con máscara. En el HTML, cada palabra: <span class="mask"><span class="m-in">palabra</span></span>
     (la clave, con class="m-in acento"). CSS en MASCARA_CSS. Palabras cada 0,09 s, 0,8 s; salida a la mitad. */
  function revelar(tl, sel, t0, o = {}) {
    const ws = gsap.utils.toArray(sel);
    tl.fromTo(ws, { yPercent: 118, rotate: o.inclina ?? 5 }, { yPercent: 0, rotate: 0, duration: o.dur ?? 0.8, ease: "expo.out", stagger: o.paso ?? 0.09 }, t0);
    if (o.salida != null) tl.to(ws, { yPercent: -118, duration: o.durSalida ?? 0.45, ease: "power3.in", stagger: o.pasoSalida ?? 0.03 }, o.salida);
    return tl;
  }
  const MASCARA_CSS = ".mask{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .06em .16em;margin:-.06em -.06em -.16em}" +
    ".mask>.m-in{display:inline-block;transform-origin:0% 100%}.m-in.acento{color:var(--coral teja,#DF663F)}" +
    ".rodar{display:inline-grid;overflow:hidden;vertical-align:bottom}.rodar>span{grid-area:1/1}";

  /* Cifra que rueda. HTML: <span class="rodar" id="x"><span>6 años</span><span>&lt; 1 año</span></span> */
  function rodar(tl, sel, t0, dur = 0.5) {
    const [a, b] = gsap.utils.toArray(sel + " > span");
    tl.fromTo(b, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: dur, ease: "power3.inOut" }, t0);
    tl.fromTo(a, { yPercent: 0, opacity: 1 }, { yPercent: -100, opacity: 0, duration: dur, ease: "power3.inOut" }, t0);
    return tl;
  }

  /* Objeto que viaja por un arco (y estela opcional). pieza y copias son elementos ya escritos en el HTML; las copias
     (2 a 4, con la misma forma) van detrás y se ven solo cuando la pieza va rápida. La pieza se estira al moverse. */
  function arco(tl, pieza, t0, dur, desde, hasta, o = {}) {
    const alto = o.alto ?? 70, copias = gsap.utils.toArray(o.copias || []), fps = o.fps ?? 30;
    const pos = (p) => { const e = gsap.parseEase(o.ease || "power3.inOut")(clamp01(p)); return { x: lerp(desde.x, hasta.x, e), y: lerp(desde.y, hasta.y, e) - Math.sin(e * Math.PI) * alto }; };
    const el = gsap.utils.toArray(pieza)[0], st = { p: 0 };
    const pinta = () => {
      const p = st.p, a = pos(p), b = pos(p - 1 / (fps * dur));
      const vx = a.x - b.x, vy = a.y - b.y;
      gsap.set(el, { x: a.x, y: a.y, scaleX: 1 + Math.min(0.45, Math.abs(vx) / 220), scaleY: 1 + Math.min(0.45, Math.abs(vy) / 220) });
      copias.forEach((c, i) => {
        const r = pos(p - (i + 1) * 2 / (fps * dur)), d = Math.hypot(r.x - a.x, r.y - a.y);
        gsap.set(c, { x: r.x, y: r.y, opacity: p > 0 && p < 1 ? Math.min(0.28, d / 180) * (1 - i / copias.length) : 0 });
      });
    };
    tl.to(st, { p: 1, duration: dur, ease: "none", onUpdate: pinta, onStart: pinta }, t0);
    tl.call(pinta, null, 0);
    return tl;
  }

  /* Iris: un círculo coral teja (escrito en el HTML con el diámetro final, class="iris") que crece y abre la escena
     siguiente. escena (opcional) aparece dentro del círculo con clip-path. Una vez por vídeo: es el momento fuerte. */
  function iris(tl, circulo, t0, dur, cx, cy, rMax, o = {}) {
    const r0 = o.r0 ?? 27;
    tl.set(circulo, { opacity: 0, scale: r0 / rMax }, 0);              // oculto hasta que empieza
    tl.set(circulo, { opacity: 1 }, t0);
    tl.fromTo(circulo, { scale: r0 / rMax }, { scale: 1, duration: dur, ease: "power3.inOut", immediateRender: false }, t0);
    if (o.escena) tl.fromTo(o.escena, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${rMax}px at ${cx}px ${cy}px)`, duration: dur, ease: "power3.inOut" }, t0 + dur * 0.6);
    return tl;
  }

  /* Trazo vivo: las líneas tiemblan como dibujadas a mano (intuición) y se quedan nítidas al contrastar.
     En el HTML: <svg width="0" height="0"><filter id="trazoVivo"><feTurbulence id="tvTurb" type="fractalNoise"
     baseFrequency=".022" numOctaves="2" seed="1" result="n"/><feDisplacementMap id="tvDisp" in="SourceGraphic" in2="n"
     scale="9" xChannelSelector="R" yChannelSelector="G"/></filter></svg> y filter="url(#trazoVivo)" en lo que tiembla.
     Tiembla desde 0 hasta tNitido, y se aclara en durAclara segundos. */
  function trazoVivo(tl, total, tNitido, durAclara = 0.6) {
    tl.fromTo("#tvTurb", { attr: { seed: 0 } }, { attr: { seed: Math.round(total * 12) }, duration: total, ease: `steps(${Math.round(total * 12)})` }, 0);
    tl.fromTo("#tvDisp", { attr: { scale: 9 } }, { attr: { scale: 0 }, duration: durAclara, ease: "power3.inOut" }, tNitido);
    return tl;
  }

  /* Grano de película que cambia cada dos fotogramas. En el HTML, encima de todo:
     <svg class="grano" width="W" height="H" style="position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;opacity:.07">
     <filter id="granoF"><feTurbulence id="granoT" type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="1"/>
     <feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#granoF)"/></svg>
     Opacidad 0,06-0,09 en tema oscuro, 0,04 en marfil. */
  function grano(tl, total) {
    const n = Math.round(total * 15);
    tl.fromTo("#granoT", { attr: { seed: 0 } }, { attr: { seed: n }, duration: total, ease: `steps(${n})` }, 0);
    return tl;
  }

  root.Movimiento = { banda, revelar, rodar, arco, iris, trazoVivo, grano, MASCARA_CSS };
})(typeof window !== "undefined" ? window : globalThis);

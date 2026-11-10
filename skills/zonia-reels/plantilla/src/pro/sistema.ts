import type React from 'react';
import {Easing, spring} from 'remotion';
import {C, S, acento, acento2, alCambiarTema, fontFamily, fontTexto, rgba} from '../tema';

// Sistema visual "pro" con la marca zonia (tema claro u oscuro, ver tema.ts).
// Fondo limpio, titulares grandes en tipo oración (tinta o marfil y una palabra en coral teja), tarjetas
// sólidas con el icono en un cuadrado, etiquetas espaciadas, pastillas de estado con punto y piezas que se
// encienden al nombrarlas. Solo las tipografías de la marca (Nunito, Geist y Geist Mono para cifras).
export const SANS = fontFamily;
export const TEXTO = fontTexto;

export const W = 1080;
export const H = 1920;
// Zonas (px del lienzo). Arriba ~220 y abajo ~360 son de la interfaz de Instagram, y a la derecha, por debajo de
// y≈1000, van sus botones: ahí nada que haya que leer pasa de x≈940.
// ZONA: la pieza que va sobre el pecho en el plano de cara. "padDer" es el margen interior derecho para lo que se
// alinea a la derecha (pastillas, botones): el borde de la tarjeta puede quedar bajo los botones; su contenido, no.
export const ZONA = {x: 80, ancho: 920, top: 916, fondo: 1376, pad: 40, padDer: 80};
export const SUBS = {top: 1400, tam: 56, fondo: 1540};
export const HUD = {x: 56, y: 236, alto: 92};
// Escenas a pantalla completa: titular en "top"; contenido hasta "abajo"; "padDer" como en ZONA.
export const ESCENA = {izq: 72, der: 1008, top: 344, abajo: 1340, padDer: 86};
export const SEGURO = {arriba: 220, abajo: 1560, derecha: 950, botonesDesde: 1000};
// Doble pantalla: la persona en la mitad de abajo y la animación de lo que explica en la de arriba. "costura" es
// dónde se parte la pantalla; arriba, lo que hay que leer va entre "top" y "abajo" (por encima quedan el capítulo
// y el logo); abajo, la barbilla queda en "barbilla", 52 px por encima de los subtítulos.
export const DOBLE = {costura: 900, izq: 72, der: 1008, top: 340, abajo: 870, barbilla: 1348};
// Ancho máximo de un texto grande centrado sobre la grabación (titular, sentencia): centrado en 540 llega a x=940
export const ANCHO_TITULAR = 800;
// Tamaños mínimos de letra (px del lienzo): por debajo de 26 no se lee en un móvil
export const TXT = {min: 26, rotulo: 28};

// Lo que el estilo pro añade a la paleta de tema.ts. Se recalcula cuando cambia el tema (claro u oscuro).
export const D = {
	tarjeta: '',
	tarjetaSel: '',
	bordeSel: '',
	sombraSel: '',
	icoFondo: '',
	icoBorde: '',
	icoFondoOff: '',
	tituloOff: '',
	hueco: '', // paneles dentro de una tarjeta
	pastilla: '',
	pastillaAzul: '', // "azul" es el acento de la marca (el coral teja de zonia)
	pastillaAzulBorde: '',
	pastillaAzulTexto: '',
	bordeVideo: '', // tarjeta sobre la grabación: borde algo más claro para separarla de la ropa
	sombraVideo: '',
};
export type Estado = 'blue' | 'green' | 'amber' | 'red';
export const ESTADO: Record<Estado, {texto: string; borde: string; fondo: string; punto: string}> = {
	blue: {texto: '', borde: '', fondo: '', punto: ''},
	green: {texto: '', borde: '', fondo: '', punto: ''},
	amber: {texto: '', borde: '', fondo: '', punto: ''},
	red: {texto: '', borde: '', fondo: '', punto: ''},
};
alCambiarTema(() => {
	const claro = S.claro;
	Object.assign(D, {
		tarjeta: C.card,
		tarjetaSel: `linear-gradient(${acento(claro ? 0.09 : 0.12)}, ${acento(claro ? 0.09 : 0.12)}), ${C.card}`,
		bordeSel: acento(0.65),
		sombraSel: `0 0 0 1px ${acento(0.22)}, 0 26px 70px -26px ${acento2(claro ? 0.35 : 0.55)}`,
		icoFondo: acento(claro ? 0.1 : 0.12),
		icoBorde: acento(claro ? 0.35 : 0.3),
		icoFondoOff: claro ? 'rgba(66,89,106,.07)' : 'rgba(168,190,201,.07)',
		tituloOff: claro ? '#B89A78' : '#B89A78',
		hueco: S.hueco,
		pastilla: S.pastilla,
		pastillaAzul: acento(claro ? 0.12 : 0.16),
		pastillaAzulBorde: acento(0.5),
		pastillaAzulTexto: claro ? '#9A4020' : '#F7C9B2',
		bordeVideo: claro ? 'rgba(31,26,23,.16)' : 'rgba(168,190,201,.36)',
		sombraVideo: `0 40px 90px -30px ${S.sombra(0.95)}, 0 0 0 1px ${claro ? 'rgba(31,26,23,.05)' : 'rgba(255,255,255,.03)'}`,
	});
	const est = (hex: string, texto: string) => ({texto, borde: rgba(hex, 0.48), fondo: rgba(hex, claro ? 0.12 : 0.12), punto: hex});
	Object.assign(ESTADO.blue, est(C.blue, claro ? '#9A4020' : '#F7C9B2'));
	Object.assign(ESTADO.green, est(C.green, claro ? '#2F6449' : '#BFE3CF'));
	Object.assign(ESTADO.amber, est(C.amber, claro ? '#6E5212' : '#F0DCA6'));
	Object.assign(ESTADO.red, est(C.red, claro ? '#8A2C27' : '#F3BCB8'));
});

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
// 0 antes de a, 1 después de b
export const rampa = (t: number, a: number, b: number) => clamp01((t - a) / Math.max(1e-6, b - a));
export const sale = Easing.out(Easing.cubic);
export const entraSale = Easing.inOut(Easing.cubic);
export const mezcla = (a: number, b: number, p: number) => a + (b - a) * p;

// Resorte que arranca en t0 (segundos). 0 antes de t0.
export const resorte = (
	t: number,
	t0: number,
	fps: number,
	cfg: {damping?: number; stiffness?: number; mass?: number} = {},
) => (t < t0 ? 0 : spring({frame: (t - t0) * fps, fps, config: {damping: 17, stiffness: 190, mass: 0.7, ...cfg}}));

// Entrada y salida de una pieza: sube con resorte y se va con un fundido corto. Con salida = 0 no se funde:
// desaparece de golpe en "f" (para cuando la tapa la cortina de una escena).
export const vida = (t: number, i: number, f: number, fps: number, salida = 0.18) => {
	const e = i < 0.05 ? 1 : resorte(t, i, fps);
	const s = salida > 0 ? 1 - rampa(t, f - salida, f) : 1;
	return {e, s, op: Math.min(1, e * 1.5) * s};
};
// Pequeño latido al encenderse algo (0 → pico → 0 mientras el resorte va de 0 a 1)
export const latido = (r: number, fuerza = 0.07) => 1 + fuerza * Math.sin(Math.PI * clamp01(r));
// Algo que espera apagado y se enciende en "en": 0 apagado, 1 encendido. Resorte suave: tarda unos 0,2 s y casi no
// rebota (a 25 fotogramas por segundo, uno más seco se ve como un salto de dos fotogramas).
// Arranca 0,05 s antes de "en": las piezas cambian de color cuando el resorte pasa de la mitad, y sin ese adelanto
// el cambio se veía 0,1 s después de empezar la palabra (dos o tres fotogramas tarde).
export const ADELANTO = 0.05;
export const enciende = (t: number, en: number | undefined, fps: number) =>
	en === undefined ? 1 : resorte(t, en - ADELANTO, fps, {damping: 15, stiffness: 180, mass: 0.7});
// Pulso de un golpe (0 → 1 → 0): sube en dos fotogramas y vuelve sin rebotar. dt = segundos desde el golpe.
export const pulso = (dt: number, subida = 0.07, caida = 0.13) =>
	dt < 0 ? 0 : Math.min(1, dt / subida) * Math.exp(-Math.max(0, dt - subida) / caida);

// Sombra del texto que va sobre la grabación (igual en los dos temas)
export const SOMBRA_TXT = '0 8px 30px rgba(10,18,21,.65), 0 2px 6px rgba(10,18,21,.75)';
// El acento nunca va en degradado: estos dos se quedan con el nombre, pero son el acento liso
export const degradadoAcento = () => C.blue;
export const textoAcento = (): React.CSSProperties => ({color: C.blue});
export const brillo = (a = 0.5) => `0 0 60px ${acento(a)}, 0 0 20px ${acento2(a * 0.8)}`;

// Titular: Nunito 800 en tipo oración (solo la inicial en mayúscula, como se escriba en el guion), apretado
export const titular = (px: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	fontFamily: SANS,
	fontSize: px,
	fontWeight: 800,
	letterSpacing: '-.015em',
	lineHeight: 1.04,
	whiteSpace: 'nowrap',
	...extra,
});
// Etiqueta de acento espaciada ("LA CLAVE", "LA PREGUNTA")
export const rotulo = (px: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	fontFamily: SANS,
	fontSize: px,
	fontWeight: 800,
	letterSpacing: '.2em',
	textTransform: 'uppercase',
	whiteSpace: 'nowrap',
	color: C.blue,
	...extra,
});
// Título de tarjeta: mayúsculas espaciadas
export const tituloFicha = (px: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	fontFamily: SANS,
	fontSize: px,
	fontWeight: 800,
	letterSpacing: '.12em',
	textTransform: 'uppercase',
	whiteSpace: 'nowrap',
	color: C.text,
	...extra,
});
// Texto corrido en el tono suave (lo importante, en el color del texto con <b>). Geist es el texto de la
// marca (como en zonia.space); a tamaño de móvil se queda en 500 para que no se pierda.
export const cuerpo = (px: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	fontFamily: TEXTO,
	fontSize: px,
	fontWeight: 500,
	color: C.muted,
	whiteSpace: 'nowrap',
	...extra,
});

// Ancho aproximado de un texto en Nunito 800, en em (para ajustar tamaños sin medir). Distingue mayúsculas y
// minúsculas: los titulares van en tipo oración y las etiquetas, en mayúsculas.
export const anchoEm = (s: string) =>
	[...s].reduce(
		(a, c) =>
			a +
			(/[IÍ1 .,:;!¡'|]/.test(c) ? 0.3 : /[ilíjtf]/.test(c) ? 0.32 : /[MWÑ]/.test(c) ? 0.92 : /[mw]/.test(c) ? 0.84 : /[0-9]/.test(c) ? 0.62 : /[a-zñáéóúü]/.test(c) ? 0.57 : 0.72),
		0,
	);
// Tamaño de letra para que un texto quepa en "ancho" px, sin pasar de "max". mayus: si se va a escribir en mayúsculas
export const ajustar = (texto: string, ancho: number, max: number, mayus = true) =>
	Math.min(max, Math.floor(ancho / anchoEm(mayus ? texto.toUpperCase() : texto)));
// Parte un texto en dos líneas lo más iguales posible (para botones y respuestas largas)
export const partir2 = (texto: string): string[] => {
	const ps = texto.split(' ');
	if (ps.length < 2) return [texto];
	let mejor = 1;
	let dif = Infinity;
	for (let k = 1; k < ps.length; k++) {
		const d = Math.abs(anchoEm(ps.slice(0, k).join(' ').toUpperCase()) - anchoEm(ps.slice(k).join(' ').toUpperCase()));
		if (d < dif) {
			dif = d;
			mejor = k;
		}
	}
	return [ps.slice(0, mejor).join(' '), ps.slice(mejor).join(' ')];
};

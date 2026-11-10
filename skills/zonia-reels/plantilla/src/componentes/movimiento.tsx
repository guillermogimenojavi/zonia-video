// Piezas de movimiento para que las animaciones no parezcan genéricas (de claude-motion, MIT, adaptadas a zonia).
// Cuándo usar cada una y con qué tiempos: zonia-video/references/movimiento.md.
// Todo es función del fotograma: se puede renderizar cualquier instante por separado.
import React from 'react';
import {AbsoluteFill, Easing, spring, SpringConfig, useVideoConfig} from 'remotion';
import {acento, rgba} from '../tema';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// Entrada, salida, de un estado a otro y aterrizaje (un valor que llega y se asienta)
export const curvas = {
	entrada: Easing.bezier(0.16, 1, 0.3, 1),
	salida: Easing.bezier(0.6, 0, 0.9, 0.35),
	cambio: Easing.bezier(0.65, 0, 0.35, 1),
	llega: Easing.bezier(0.55, 0, 0.2, 1.12),
};

// Progreso 0..1 entre t0 y t1 (segundos) con una curva
export const prog = (t: number, t0: number, t1: number, curva: (x: number) => number = curvas.cambio) =>
	curva(clamp01((t - t0) / (t1 - t0)));

// 0..1 suave cuando x pasa de a a b: para derivar una animación de otro valor en vez de darle reloj propio
export const banda = (x: number, a: number, b: number) => {
	const k = clamp01((x - a) / (b - a));
	return k * k * (3 - 2 * k);
};

// Resorte que empieza en el segundo `desde`. Presets en movimiento.md § 3.
export const muelle = (frame: number, fps: number, desde: number, config: Partial<SpringConfig> = {}) => {
	const fr = frame - desde * fps;
	return fr <= 0 ? 0 : spring({frame: fr, fps, config: {damping: 14, mass: 0.8, stiffness: 140, ...config}});
};

// Objeto que viaja por un arco: la misma pieza cruza escenas y cambia de papel
export const arco = (t: number, t0: number, t1: number, x0: number, y0: number, x1: number, y1: number, alto = 70) => {
	const p = prog(t, t0, t1, curvas.cambio);
	return {x: lerp(x0, x1, p), y: lerp(y0, y1, p) - Math.sin(p * Math.PI) * alto, p};
};

// Estela por velocidad: posiciones anteriores y estiramiento. `pos` da {x, y} para un instante.
//   const e = estela(pos, t); e.estira -> escala en la dirección del movimiento; e.copias -> dónde pintar las copias
export const estela = (pos: (t: number) => {x: number; y: number}, t: number, fps: number, n = 4) => {
	const p = pos(t);
	const q = pos(t - 1 / fps);
	const vx = p.x - q.x;
	const vy = p.y - q.y;
	const copias = Array.from({length: n}, (_, i) => {
		const r = pos(t - ((i + 1) * 2) / fps);
		const dist = Math.hypot(r.x - p.x, r.y - p.y);
		return {...r, opacidad: Math.min(0.28, dist / 180) * (1 - i / n)};
	});
	return {
		...p,
		estiraX: 1 + Math.min(0.45, Math.abs(vx) / 220),
		estiraY: 1 + Math.min(0.45, Math.abs(vy) / 220),
		copias,
	};
};

// Revelado con máscara: la palabra sube desde dentro de su renglón con una leve inclinación.
// k 0 -> 1 la trae; salida 0 -> 1 la saca por arriba. Palabras cada 0,09 s, 0,8 s de entrada, salida a la mitad.
export const Mascara: React.FC<{
	k: number;
	salida?: number;
	inclina?: number;
	style?: React.CSSProperties;
	children: React.ReactNode;
}> = ({k, salida = 0, inclina = 5, style, children}) => (
	<span
		style={{
			display: 'inline-block',
			overflow: 'hidden',
			verticalAlign: 'bottom',
			padding: '0.06em 0.06em 0.16em',
			margin: '-0.06em -0.06em -0.16em',
		}}
	>
		<span
			style={{
				display: 'inline-block',
				transform: `translateY(${(1 - k - salida) * 118}%) rotate(${(1 - k) * inclina}deg)`,
				transformOrigin: '0% 100%',
				...style,
			}}
		>
			{children}
		</span>
	</span>
);

// Cifra que rueda: k = 0 enseña a, k = 1 enseña b
export const Rodar: React.FC<{a: React.ReactNode; b: React.ReactNode; k: number; style?: React.CSSProperties}> = ({
	a,
	b,
	k,
	style,
}) => (
	<span style={{position: 'relative', display: 'inline-grid', overflow: 'hidden', verticalAlign: 'bottom', ...style}}>
		<span style={{gridArea: '1 / 1', transform: `translateY(${-k * 100}%)`, opacity: 1 - k}}>{a}</span>
		<span style={{gridArea: '1 / 1', transform: `translateY(${(1 - k) * 100}%)`, opacity: k}}>{b}</span>
	</span>
);

// Iris: un círculo coral teja que crece desde r0 y abre la escena siguiente. Úsalo una vez por vídeo (momento fuerte).
// Para que la escena nueva aparezca dentro: style={{clipPath: `circle(${radio}px at ${cx}px ${cy}px)`}}.
export const Iris: React.FC<{radio: number; cx: number; cy: number; brillo?: number}> = ({radio, cx, cy, brillo = 0.5}) =>
	radio <= 0 ? null : (
		<div
			style={{
				position: 'absolute',
				left: cx - radio,
				top: cy - radio,
				width: radio * 2,
				height: radio * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${acento(1)} 0%, #DF663F 55%, #B74B25 100%)`,
				boxShadow: `0 0 ${40 + 60 * brillo}px ${rgba('#DF663F', 0.55)}`,
			}}
		/>
	);

// Trazo vivo: las líneas tiemblan como dibujadas a mano (intuición) y se quedan nítidas al contrastar (cantidad 0).
// Pon <TrazoVivo frame={frame} cantidad={x} /> una vez y filter: 'url(#trazoVivo)' en lo que deba temblar.
export const TrazoVivo: React.FC<{frame: number; cantidad: number}> = ({frame, cantidad}) => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<filter id="trazoVivo" x="-4%" y="-4%" width="108%" height="108%">
			<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={Math.floor(frame / 5) % 53} result="ruido" />
			<feDisplacementMap in="SourceGraphic" in2="ruido" scale={clamp01(cantidad) * 9} xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</svg>
);

// Grano de película que cambia cada dos fotogramas. Opacidad: 0,06-0,09 en tema oscuro, 0,04 en marfil.
export const Grano: React.FC<{frame: number; opacidad?: number}> = ({frame, opacidad = 0.07}) => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: opacidad}}>
			<svg width={width} height={height}>
				<filter id="grano" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 97} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width={width} height={height} filter="url(#grano)" />
			</svg>
		</AbsoluteFill>
	);
};

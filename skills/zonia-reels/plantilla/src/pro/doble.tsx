import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import {C, S, V, acento, fondoVideo} from '../tema';
import {useT} from '../componentes/comun';
import {Fondo, IcoCuadro, Trozo} from './base';
import {Ico} from './iconos';
import {D, DOBLE, ESTADO, Estado, H, SANS, W, anchoEm, clamp01, cuerpo, enciende, entraSale, latido, rampa, resorte, sale, titular} from './sistema';

// Doble pantalla: la persona en la mitad de abajo y, en la de arriba, la animación de lo que está explicando.
// Es el cuarto plano del modo pro (cara + pieza, escena, primer plano y este). Sirve para explicaciones largas con
// una estructura que se va construyendo (una lista, una escalera, unos pasos): la persona sigue a la vista.
// En el guion es la pieza "doble" (ver references/guion-pro.md); edl_pro.py le pone el vídeo ancho, sus medidas y
// el encuadre de cada tramo.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Logos = Record<string, string>;
type En = {en: number};
const EPS = 0.002;

// ---------------------------------------------------------------------------------------------------------------
// El plano. Abajo, la grabación en un recorte más ancho que el del plano de cara (reels/<reel>/ancho.mp4, con los
// mismos cortes que base.mp4; lo genera `reel.py edl`); arriba, el fondo de las escenas y lo que se le pase.
// Entra y sale en un corte, de golpe: es un cambio de plano, no una cortina.
// - "fuente": medidas del recorte ancho, en píxeles del original: su ancho y su alto, la x del centro de la cara y
//   la y de la barbilla.
// - "planos": [desde, escala] por cada tramo que abarca (escala = px del lienzo por px del original). El zoom se
//   ancla en la barbilla, que queda siempre en DOBLE.barbilla: 52 px por encima de los subtítulos.
// Los subtítulos, el capítulo y el logo de la marca siguen en su sitio.
export type FuenteDoble = {ancho: number; alto: number; caraX: number; barbilla: number};
export type PropsDoble = {i: number; f: number; video: string; fuente: FuenteDoble; planos: [number, number][]; filtro?: string};
export const Doble: React.FC<PropsDoble & {children: React.ReactNode}> = ({i, f, video, fuente, planos, filtro, children}) => {
	const {t} = useT();
	if (t < i - EPS || t >= f - EPS) return null;
	const COSTURA = DOBLE.costura;
	let k = 0;
	planos.forEach((p, n) => {
		if (t >= p[0] - EPS) k = n;
	});
	const desde = planos[k][0];
	const hasta = k + 1 < planos.length ? planos[k + 1][0] : f;
	const s = planos[k][1] * (1 + 0.02 * entraSale(rampa(t, desde, hasta))); // empuje lento dentro del tramo
	const w = fuente.ancho * s;
	const h = fuente.alto * s;
	const left = W / 2 - fuente.caraX * s;
	const top = DOBLE.barbilla - fuente.barbilla * s - COSTURA; // dentro de la mitad de abajo
	const hueco = Math.max(0, top);
	const src = staticFile(video);
	const luz = rampa(t, i, i + 0.6);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, top: COSTURA, width: W, height: H - COSTURA, overflow: 'hidden', background: V.fondo}}>
				<div style={{position: 'absolute', inset: 0, filter: filtro}}>
					{/* si el vídeo no llega hasta la costura, el fondo se prolonga hacia arriba (como en el plano de cara) */}
					{hueco > 0 ? (
						<div style={{position: 'absolute', left, top: 0, width: w, height: hueco + 4, overflow: 'hidden'}}>
							<OffthreadVideo src={src} muted style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scaleY(${(hueco + 4) / 3})`, transformOrigin: 'top', filter: 'blur(2px)'}} />
						</div>
					) : null}
					<OffthreadVideo src={src} muted style={{position: 'absolute', left, top, width: w, height: h}} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 90, background: `linear-gradient(180deg, ${fondoVideo(0.5)}, ${fondoVideo(0)})`}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 1560 - COSTURA, bottom: 0, background: `linear-gradient(180deg, ${fondoVideo(0)} 0%, ${fondoVideo(0.62)} 55%, ${V.fondo} 86%)`}} />
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, width: W, height: COSTURA, overflow: 'hidden'}}>
				<Fondo />
				{children}
			</div>
			{/* la costura, con un filo de luz que la recorre al entrar */}
			<div style={{position: 'absolute', left: 0, top: COSTURA - 2, width: W, height: 3, background: C.blue /* acento liso */, boxShadow: `0 0 26px 2px ${acento(0.45)}`}} />
			{luz < 1 ? (
				<div style={{position: 'absolute', left: -260 + (W + 520) * sale(luz) - 130, top: COSTURA - 4, width: 260, height: 7, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${S.filo[1]}, transparent)`, boxShadow: `0 0 40px 10px ${acento(0.6)}`, opacity: Math.sin(Math.PI * luz)}} />
			) : null}
		</AbsoluteFill>
	);
};

// Lo que recibe cada cuerpo de la mitad de arriba además de sus datos: la franja en la que dibuja (y0–y1, entre
// DOBLE.izq y DOBLE.der), desde cuándo y hasta cuándo está, y los logos del guion.
export type ZonaDoble = {y0: number; y1: number; desde: number; hasta: number; logos: Logos};

// ---------------------------------------------------------------------------------------------------------------
// Escalera: los elementos de una familia, de arriba abajo (modelos, planes, niveles, pasos). Todos se ven desde el
// principio, apagados; con "apunta" la fila se abre y enseña sus líneas, también apagadas; con "en" se enciende
// su nombre y cada línea, en su palabra. Al abrirse la siguiente, la anterior se recoge y deja a la derecha su
// resumen ("corto"). "tam" es el tamaño del logo de cada fila: de mayor a menor dice «del grande al pequeño».
type LineaEsc = {texto: string; en: number; estado?: Estado};
type FilaEsc = {nombre: string; logo?: string; icono?: string; tam?: number; apunta?: number; en: number; corto?: string; lineas?: LineaEsc[]};
const Escalera: React.FC<ZonaDoble & {filas: FilaEsc[]; aparece?: number[]; marca?: En}> = ({y0, y1, desde, logos, filas, aparece, marca}) => {
	const {t, fps} = useT();
	const n = filas.length;
	const GAP = 12;
	const X = DOBLE.izq;
	const AN = DOBLE.der - DOBLE.izq;
	const maxL = Math.max(1, ...filas.map((r) => r.lineas?.length ?? 0));
	const ACT = Math.max(96, 46 + 50 * maxL); // la fila abierta
	const COMP = n > 1 ? Math.min(96, Math.floor((y1 - y0 - 8 - ACT - (n - 1) * GAP) / (n - 1))) : ACT; // las recogidas
	const letra = Math.round(COMP * 0.5);
	const abre = filas.map((r) => clamp01(resorte(t, (r.apunta ?? r.en) - 0.04, fps, {damping: 22, stiffness: 190})));
	const e = abre.map((a, k) => (filas[k].lineas?.length ? a * (k + 1 < n ? 1 - abre[k + 1] : 1) : 0));
	const E = clamp01(e.reduce((a, b) => a + b, 0));
	let y = y0 + 4 + ((ACT - COMP) / 2) * (1 - E);
	return (
		<>
			{filas.map((r, k) => {
				const alto = COMP + (ACT - COMP) * e[k];
				const top = y;
				y += alto + GAP;
				const sale0 = aparece?.[k] ?? desde + 0.08 + k * 0.18;
				if (t < sale0) return null;
				const entra = resorte(t, sale0, fps, {damping: 18, stiffness: 200});
				const lit = enciende(t, r.en, fps);
				const on = lit > 0.5;
				const sel = e[k] > 0.5 || (!r.lineas?.length && abre[k] > 0.5 && (k + 1 >= n || abre[k + 1] < 0.5));
				const logoOn = marca ? enciende(t, marca.en + k * 0.09, fps) : 1;
				const lineas = r.lineas ?? [];
				return (
					<div
						key={k}
						style={{
							position: 'absolute',
							left: X,
							top,
							width: AN,
							height: alto,
							boxSizing: 'border-box',
							borderRadius: 24,
							background: sel ? D.tarjetaSel : D.tarjeta,
							border: `1.5px solid ${sel ? D.bordeSel : on ? S.bordeSuave : C.line2}`,
							boxShadow: sel ? D.sombraSel : 'none',
							opacity: clamp01(entra * 1.6),
							transform: `translateY(${(1 - entra) * -22}px)`,
							overflow: 'hidden',
						}}
					>
						<div style={{position: 'absolute', left: 26, top: 0, width: 72, height: alto, display: 'grid', placeItems: 'center'}}>
							<IcoCuadro size={r.tam ?? Math.round(COMP * 0.62)} logo={r.logo ? logos[r.logo] : undefined} icono={r.icono} on={Math.max(clamp01(logoOn), clamp01(lit))} style={{transform: `scale(${marca ? latido(logoOn, 0.1) : 1})`}} />
						</div>
						<span style={{position: 'absolute', left: 120, top: alto / 2 - letra * 0.56, ...titular(letra, {color: on ? C.text : D.tituloOff, lineHeight: `${Math.round(letra * 1.12)}px`}), transform: `scale(${latido(lit, 0.05)})`, transformOrigin: '0 50%'}}>{r.nombre}</span>
						{r.corto ? (
							<span style={{position: 'absolute', right: 30, top: alto / 2 - 19, ...cuerpo(30, {lineHeight: '38px', color: S.textoPie}), opacity: clamp01(lit) * clamp01(1 - e[k] * 2.2)}}>{r.corto}</span>
						) : null}
						<div style={{position: 'absolute', left: Math.round(AN * 0.49), top: (ACT - lineas.length * 50) / 2, opacity: clamp01(e[k] * 2.4 - 1.2)}}>
							{lineas.map((l, j) => {
								const le = enciende(t, l.en, fps);
								const dicho = le > 0.5;
								const est = ESTADO[l.estado ?? 'blue'];
								return (
									<div key={j} style={{display: 'flex', alignItems: 'center', gap: 14, height: 50, transform: `scale(${latido(le, 0.06)})`, transformOrigin: '0 50%'}}>
										<span style={{width: 12, height: 12, borderRadius: '50%', background: dicho ? est.punto : C.line2, boxShadow: dicho ? `0 0 12px ${est.punto}` : 'none'}} />
										<span style={{fontFamily: SANS, fontSize: 32, fontWeight: 800, color: !dicho ? C.dim : l.estado && l.estado !== 'blue' ? est.texto : C.text, whiteSpace: 'nowrap'}}>{l.texto}</span>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</>
	);
};

// ---------------------------------------------------------------------------------------------------------------
// Iconos: de 2 a 4 cosas corrientes en fila, cada una en su cuadro, que entra cuando se nombra («lo de todos los
// días»: un documento, un correo, una factura…). Sirve de arranque antes de que otros cuerpos las desarrollen.
const Iconos: React.FC<ZonaDoble & {items: {icono?: string; logo?: string; en: number}[]}> = ({y0, y1, logos, items}) => {
	const {t, fps} = useT();
	const n = items.length;
	const AN = DOBLE.der - DOBLE.izq;
	const SEP = 40;
	const lado = Math.min(204, Math.floor((AN - (n - 1) * SEP) / n), y1 - y0);
	const x0 = DOBLE.izq + (AN - (n * lado + (n - 1) * SEP)) / 2;
	const top = y0 + (y1 - y0 - lado) / 2;
	return (
		<>
			{items.map((it, k) => {
				if (t < it.en) return null;
				const a = resorte(t, it.en, fps, {damping: 16, stiffness: 200});
				return (
					<div key={k} style={{position: 'absolute', left: x0 + k * (lado + SEP), top, width: lado, height: lado, boxSizing: 'border-box', borderRadius: 30, background: D.tarjeta, border: `1.5px solid ${C.line2}`, display: 'grid', placeItems: 'center', opacity: clamp01(a * 1.6), transform: `translateY(${(1 - a) * 26}px)`}}>
						{it.logo ? <IcoCuadro size={lado * 0.6} logo={logos[it.logo]} /> : <Ico nombre={it.icono ?? 'documento'} size={lado * 0.47} color={C.muted} grosor={1.7} />}
					</div>
				);
			})}
		</>
	);
};

export const CUERPOS_DOBLE: Record<string, React.FC<any>> = {escalera: Escalera, iconos: Iconos};

// ---------------------------------------------------------------------------------------------------------------
// La pieza "doble" del guion: el plano y, arriba, un titular opcional (la pregunta que se hace el espectador),
// unos tramos de avance opcionales (uno por cada cosa que se va a contar; se llenan en su instante) y uno o varios
// cuerpos que se relevan, como en la pieza "escena": cada uno entra en su "en" y el anterior se va.
type CuerpoDoble = {tipo: string; en?: number} & Record<string, any>;
export const EscenaDoble: React.FC<
	PropsDoble & {titulo?: Trozo[][]; avance?: number[]; cuerpos?: CuerpoDoble[]; logos: Logos; propios?: Record<string, React.FC<any>>}
> = ({titulo, avance, cuerpos = [], logos, propios = {}, ...plano}) => {
	const {t, fps} = useT();
	const {i, f} = plano;
	const X = DOBLE.izq;
	const AN = DOBLE.der - DOBLE.izq;
	const tit = resorte(t, i + 0.06, fps, {damping: 17, stiffness: 180});
	const linea = titulo?.[0] ?? [];
	const tam = Math.min(66, Math.floor((AN - 56) / Math.max(1, anchoEm(linea.map((x) => x.t).join('')))));
	const y0 = DOBLE.top + (titulo ? 84 : 0) + (avance ? 32 : 0);
	return (
		<Doble {...plano}>
			{titulo ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: DOBLE.top - 2, textAlign: 'center', ...titular(tam, {color: C.text, whiteSpace: 'pre', lineHeight: '70px'}), opacity: clamp01(tit * 1.6), transform: `translateY(${(1 - tit) * 20}px)`}}>
					{linea.map((x, j) => (
						<span key={j} style={x.azul ? {color: C.blue} : undefined}>
							{x.t}
						</span>
					))}
				</div>
			) : null}
			{avance ? (
				<div style={{position: 'absolute', left: X, top: y0 - 32, width: AN, display: 'flex', gap: 12, opacity: clamp01(tit * 1.6)}}>
					{avance.map((en, k) => (
						<div key={k} style={{flex: 1, height: 8, borderRadius: 4, background: C.line2, overflow: 'hidden'}}>
							<div style={{width: `${100 * sale(rampa(t, en - 0.03, en + 0.28))}%`, height: '100%', background: C.blue}} />
						</div>
					))}
				</div>
			) : null}
			{cuerpos.map((c, k) => {
				const desde = k === 0 ? i : (c.en ?? i);
				const hasta = k + 1 < cuerpos.length ? (cuerpos[k + 1].en ?? f) : f;
				const ultimo = k + 1 >= cuerpos.length;
				if (t < desde - 0.06 || (!ultimo && t >= hasta + 0.12)) return null;
				const Comp = propios[c.tipo] ?? CUERPOS_DOBLE[c.tipo];
				if (!Comp) {
					return (
						<div key={k} style={{position: 'absolute', left: X, top: y0, padding: '14px 22px', background: '#b00020', color: '#fff', fontFamily: SANS, fontSize: 34, fontWeight: 800}}>
							Cuerpo desconocido: {c.tipo}
						</div>
					);
				}
				const a = k === 0 ? 1 : sale(rampa(t, desde - 0.04, desde + 0.24));
				const b = ultimo ? 0 : rampa(t, hasta - 0.06, hasta + 0.1);
				return (
					<div key={k} style={{position: 'absolute', inset: 0, opacity: a * (1 - b), transform: `translateY(${(1 - a) * 30 - b * 18}px)`}}>
						<Comp {...c} y0={y0} y1={DOBLE.abajo} desde={desde} hasta={hasta} logos={logos} />
					</div>
				);
			})}
		</Doble>
	);
};

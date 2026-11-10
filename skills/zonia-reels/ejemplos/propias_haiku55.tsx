// EJEMPLO REAL: las piezas propias del reel de Claude Haiku 5.5 (8/10/2026), con su guion en guion_pro_haiku55.json.
// Fue el primer reel con doble pantalla (la persona abajo y la animación arriba). El plano y la escalera de modelos
// están en la plantilla (./doble); aquí queda lo que se dibujó para este tema. Para usar algo, copia su código (y
// lo que necesite de arriba) a editor/src/pro/propias.tsx de tu proyecto y apúntalo en CARA, CUERPOS o DOBLES.
// Son un modelo de cómo se diseña una pieza para un tema, no un catálogo: no las repitas tal cual en otro reel.
//
//   ventajas  (cara)             dos esferas: la velocidad sube al máximo y el precio baja al mínimo
//   precio    (cara)             la barra del precio pierde el 90 % y, después, 100 monedas frente a 1
//   prueba    (cara)             un ordenador que se maneja solo y dos barras: 16 y 72 de cada 100
//   recado    (cuerpo de escena) ir a por el pan: el camión se queda y la moto llega
//   pdf, correos, factura, chat  (cuerpos de "doble") cuatro tareas de todos los días, cada una con su dibujo:
//                                se hace cuando se nombra y deja paso a la siguiente

import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, acento} from '../tema';
import {useT} from '../componentes/comun';
import {Cabecera, Cerrojo, Chip, Ficha, IcoCuadro, Pastilla, Pie} from './base';
import {ZonaDoble} from './doble';
import {Ico} from './iconos';
import {D, DOBLE, ESCENA, ESTADO, SANS, ZONA, clamp01, cuerpo, enciende, entraSale, latido, pulso, rampa, resorte, rotulo, sale, titular, tituloFicha} from './sistema';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Logos = Record<string, string>;
type Zona = {y0: number; y1: number; desde: number; logos: Logos};
type En = {en: number};

// ---------------------------------------------------------------------------------------------------------------
// Usos (cuerpos de "doble"): «sirve para lo de todos los días». Bajo el titular y los tramos de avance, cada tarea
// tiene su dibujo, que se hace cuando se nombra y deja paso al siguiente.
const barra = (ancho: number | string, alto = 12, color = '#283246'): React.CSSProperties => ({width: ancho, height: alto, borderRadius: alto, background: color});
const caja = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	position: 'absolute',
	left: x,
	top: y,
	width: w,
	height: h,
	boxSizing: 'border-box',
	borderRadius: 20,
	background: '#0f141d',
	border: `1.5px solid ${C.line2}`,
	...extra,
});
const encendida: React.CSSProperties = {background: D.tarjetaSel, border: `1.5px solid ${D.bordeSel}`, boxShadow: D.sombraSel};

// 1) Un PDF largo que se queda en tres ideas
const DemoPdf: React.FC<{en: number; tag: number}> = ({en, tag}) => {
	const {t, fps} = useT();
	const lee = rampa(t, en + 0.08, en + 0.74);
	const lt = enciende(t, tag, fps);
	const res = resorte(t, en + 0.3, fps, {damping: 18});
	return (
		<>
			<div style={caja(70, 14, 262, 388, {overflow: 'hidden'})}>
				<span style={{position: 'absolute', left: 20, top: 20, height: 42, padding: '0 14px', display: 'inline-flex', alignItems: 'center', borderRadius: 10, background: lt > 0.5 ? C.blue : '#1a2130', border: `1.5px solid ${lt > 0.5 ? C.blue3 : C.line2}`, fontFamily: SANS, fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '.04em', transform: `scale(${latido(lt, 0.12)})`}}>PDF</span>
				{[0.82, 0.7, 0.86, 0.6, 0.8, 0.74, 0.88, 0.5].map((a, k) => (
					<div key={k} style={{position: 'absolute', left: 22, top: 92 + k * 35, ...barra(218 * a, 12, lee * 8 > k ? '#3a4a66' : '#232c3d')}} />
				))}
				{lee > 0 && lee < 1 ? <div style={{position: 'absolute', left: 0, right: 0, top: 84 + lee * 284, height: 3, background: C.blue3, boxShadow: `0 0 22px 6px ${acento(0.55)}`}} /> : null}
			</div>
			<Ico nombre="flecha" size={56} color={res > 0.5 ? C.blue : C.line2} grosor={2.6} style={{position: 'absolute', left: 356, top: 180}} />
			<div style={{...caja(436, 62, 432, 292, encendida), opacity: clamp01(res * 1.6), transform: `translateX(${(1 - res) * -30}px)`}}>
				<span style={{position: 'absolute', left: 30, top: 26, ...rotulo(28)}}>RESUMEN</span>
				{[0.78, 0.62, 0.7].map((a, k) => {
					const p = sale(rampa(t, en + 0.42 + k * 0.2, en + 0.72 + k * 0.2));
					return (
						<div key={k} style={{position: 'absolute', left: 30, top: 96 + k * 62, display: 'flex', alignItems: 'center', gap: 18, opacity: clamp01(p * 3)}}>
							<span style={{width: 16, height: 16, borderRadius: '50%', background: C.blue, boxShadow: `0 0 14px ${C.blue}`}} />
							<div style={barra(330 * a * p, 18, '#cfd8e6')} />
						</div>
					);
				})}
			</div>
		</>
	);
};

// 2) Un montón de correos que acaban cada uno en su bandeja
const Sobre: React.FC<{w: number}> = ({w}) => (
	<svg width={w} height={w * 0.7} viewBox="0 0 100 70" fill="#131a26" stroke="#8fa3c4" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
		<rect x="3" y="3" width="94" height="64" rx="9" />
		<path d="M5 9l45 31L95 9" fill="none" />
	</svg>
);
const DemoCorreos: React.FC<{en: number; ordena: number}> = ({en, ordena}) => {
	const {t, fps} = useT();
	const BANDEJAS = ['CLIENTES', 'FACTURAS', 'OTROS'];
	const DESTINO = [0, 1, 0, 2, 1];
	const MONTON: [number, number][] = [
		[96, 150],
		[150, 96],
		[60, 210],
		[176, 190],
		[112, 40],
	];
	const yB = (b: number) => 26 + b * 126;
	const llega = DESTINO.map((_, k) => sale(rampa(t, ordena + k * 0.08, ordena + k * 0.08 + 0.3)));
	return (
		<>
			{BANDEJAS.map((n, b) => {
				const cuenta = DESTINO.filter((d, k) => d === b && llega[k] >= 1).length;
				const lit = cuenta > 0;
				return (
					<div key={b} style={caja(470, yB(b), 400, 104, lit ? encendida : {})}>
						<IcoCuadro size={68} icono="folder" on={lit ? 1 : 0} style={{position: 'absolute', left: 18, top: 17}} />
						<span style={{position: 'absolute', left: 106, top: 31, fontFamily: SANS, fontSize: 32, fontWeight: 800, letterSpacing: '.04em', lineHeight: '40px', color: lit ? C.text : D.tituloOff}}>{n}</span>
						<span style={{position: 'absolute', right: 22, top: 27, width: 50, height: 50, borderRadius: '50%', display: 'grid', placeItems: 'center', background: lit ? C.blue : 'transparent', border: `1.5px solid ${lit ? C.blue : C.line2}`, fontFamily: SANS, fontSize: 28, fontWeight: 900, color: lit ? '#fff' : C.dim}}>{cuenta}</span>
					</div>
				);
			})}
			{MONTON.map(([x, y], k) => {
				if (llega[k] >= 1) return null;
				const sube = resorte(t, en + k * 0.05, fps, {damping: 16, stiffness: 210});
				const p = llega[k];
				const tx = x + (500 - x) * p;
				const ty = y + (yB(DESTINO[k]) + 14 - y) * p;
				return (
					<div key={k} style={{position: 'absolute', left: tx, top: ty, opacity: clamp01(sube * 2) * (1 - clamp01((p - 0.7) / 0.3)), transform: `scale(${(0.6 + 0.4 * clamp01(sube)) * (1 - 0.5 * p)})`, transformOrigin: '0 0', filter: 'drop-shadow(0 14px 18px rgba(0,0,0,.55))'}}>
						<Sobre w={170} />
					</div>
				);
			})}
		</>
	);
};

// 3) Una factura de la que salen sus datos, uno a uno
const DemoFactura: React.FC<{en: number; datos: number; nombre: number}> = ({en, datos, nombre}) => {
	const {t, fps} = useT();
	const ln = enciende(t, nombre, fps);
	const DATOS: [string, string, number][] = [
		['N.º', '2026-041', 96],
		['FECHA', '03/10/2026', 138],
		['TOTAL', '1.210,00 €', 318],
	];
	const sal = DATOS.map((_, k) => resorte(t, datos + k * 0.22, fps, {damping: 17, stiffness: 200}));
	const marco = (k: number, x: number, y: number, w: number) => (
		<div style={{position: 'absolute', left: x - 8, top: y - 9, width: w + 16, height: 30, borderRadius: 9, border: `2px solid ${C.blue}`, boxShadow: `0 0 18px -2px ${acento(0.8)}`, opacity: clamp01(sal[k] * 2)}} />
	);
	return (
		<>
			<div style={caja(70, 14, 286, 388)}>
				<span style={{position: 'absolute', left: 22, top: 22, ...rotulo(26, {color: ln > 0.5 ? C.text : D.tituloOff}), transform: `scale(${latido(ln, 0.08)})`, transformOrigin: '0 50%'}}>FACTURA</span>
				<div style={{position: 'absolute', left: 22, top: 96, ...barra(96, 12, '#3a4a66')}} />
				<div style={{position: 'absolute', left: 22, top: 138, ...barra(126, 12, '#3a4a66')}} />
				{marco(0, 22, 96, 96)}
				{marco(1, 22, 138, 126)}
				{[0.9, 0.72, 0.84].map((a, k) => (
					<div key={k} style={{position: 'absolute', left: 22, top: 196 + k * 34, ...barra(242 * a, 10, '#232c3d')}} />
				))}
				<div style={{position: 'absolute', left: 22, right: 22, top: 300, height: 1.5, background: C.line2}} />
				<div style={{position: 'absolute', left: 22, top: 318, ...barra(80, 12, '#232c3d')}} />
				<div style={{position: 'absolute', left: 148, top: 318, ...barra(116, 12, '#cfd8e6')}} />
				{marco(2, 148, 318, 116)}
			</div>
			{DATOS.map(([rot, valor], k) => {
				const s = sal[k];
				const ult = k === DATOS.length - 1;
				return (
					<div key={k} style={{...caja(446, 26 + k * 126, 424, 104, ult ? encendida : {border: '1.5px solid rgba(243,245,249,.22)'}), opacity: clamp01(s * 1.7), transform: `translateX(${(1 - s) * -60}px)`}}>
						<span style={{position: 'absolute', left: 26, top: 36, ...rotulo(26, {color: ult ? C.blue : C.muted, lineHeight: '32px'})}}>{rot}</span>
						<span style={{position: 'absolute', right: 26, top: 28, fontFamily: SANS, fontSize: 38, fontWeight: 900, lineHeight: '48px', color: C.text, whiteSpace: 'nowrap'}}>{valor}</span>
					</div>
				);
			})}
		</>
	);
};

// 4) El chat de una web: pregunta el cliente y la respuesta llega sola
const DemoChat: React.FC<{en: number; cliente: number; responde: number; web: number; logo: string}> = ({cliente, responde, web, logo}) => {
	const {t, fps} = useT();
	const lw = enciende(t, web, fps);
	const c = resorte(t, cliente - 0.04, fps, {damping: 15, stiffness: 220});
	const piensa = t >= cliente + 0.3 && t < responde - 0.04;
	const r = resorte(t, responde - 0.04, fps, {damping: 15, stiffness: 220});
	const globo: React.CSSProperties = {position: 'absolute', padding: '14px 20px', borderRadius: 22, fontFamily: SANS, fontSize: 27, fontWeight: 700, lineHeight: '34px', whiteSpace: 'nowrap'};
	return (
		<div style={caja(40, 8, 856, 400, {borderRadius: 24, background: '#0b1017', overflow: 'hidden'})}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 58, background: '#0f141d', borderBottom: `1.5px solid ${C.line2}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px'}}>
				<span style={{display: 'flex', gap: 8}}>
					{[0, 1, 2].map((k) => (
						<span key={k} style={{width: 13, height: 13, borderRadius: '50%', background: C.line2}} />
					))}
				</span>
				<span style={{height: 40, padding: '0 20px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', background: '#1a2130', border: `1.5px solid ${lw > 0.5 ? D.bordeSel : C.line2}`, fontFamily: SANS, fontSize: 26, fontWeight: 700, color: lw > 0.5 ? C.text : C.muted, transform: `scale(${latido(lw, 0.06)})`}}>tuweb.com</span>
			</div>
			<div style={{position: 'absolute', left: 28, top: 86, ...barra(250, 26, '#232c3d')}} />
			<div style={{position: 'absolute', left: 28, top: 132, ...barra(320, 12, '#1b2331')}} />
			<div style={{position: 'absolute', left: 28, top: 158, ...barra(270, 12, '#1b2331')}} />
			<div style={{position: 'absolute', left: 28, top: 206, width: 150, height: 150, borderRadius: 16, background: '#141b27'}} />
			<div style={{position: 'absolute', left: 196, top: 206, width: 150, height: 150, borderRadius: 16, background: '#141b27'}} />
			<div style={caja(404, 78, 430, 304, {borderRadius: 22, background: '#0f141d', border: `1.5px solid ${D.bordeSel}`, boxShadow: `0 0 50px -18px ${acento(0.8)}`})}>
				<div style={{position: 'absolute', left: 20, top: 16, display: 'flex', alignItems: 'center', gap: 10}}>
					<span style={{width: 12, height: 12, borderRadius: '50%', background: C.green, boxShadow: `0 0 10px ${C.green}`}} />
					<span style={cuerpo(26, {color: '#c3cad6', lineHeight: '30px'})}>Chat de la tienda</span>
				</div>
				{t >= cliente - 0.04 ? <span style={{...globo, right: 18, top: 68, background: '#232c3d', color: C.text, opacity: clamp01(c * 2), transform: `scale(${0.7 + 0.3 * clamp01(c)})`, transformOrigin: '100% 100%'}}>¿Hacéis envíos a Canarias?</span> : null}
				<Img src={staticFile(logo)} style={{position: 'absolute', left: 20, top: 172, width: 46, height: 46, opacity: t >= cliente + 0.3 ? 1 : 0}} />
				{piensa ? (
					<span style={{...globo, left: 80, top: 162, background: '#1a2130', display: 'flex', gap: 8, alignItems: 'center', height: 34}}>
						{[0, 1, 2].map((k) => (
							<span key={k} style={{width: 11, height: 11, borderRadius: '50%', background: t >= cliente + 0.34 + k * 0.1 ? C.blue3 : C.line2}} />
						))}
					</span>
				) : null}
				{t >= responde - 0.04 ? <span style={{...globo, left: 80, top: 162, background: `linear-gradient(180deg, ${C.blue}, ${C.blue2})`, color: '#fff', boxShadow: `0 0 30px -8px ${acento(0.9)}`, opacity: clamp01(r * 2), transform: `scale(${0.7 + 0.3 * clamp01(r)})`, transformOrigin: '0 100%'}}>Sí, llega en 3 días.</span> : null}
			</div>
		</div>
	);
};

// Cada dibujo es un cuerpo de la pieza "doble": ocupa el escenario que le deja el titular (936 × 416 desde y0)
const escenario = (y0: number, nodo: React.ReactNode) => <div style={{position: 'absolute', left: DOBLE.izq, top: y0, width: DOBLE.der - DOBLE.izq, height: 416}}>{nodo}</div>;
const UsoPdf: React.FC<ZonaDoble & {en: number; tag: number}> = ({y0, en, tag}) => escenario(y0, <DemoPdf en={en} tag={tag} />);
const UsoCorreos: React.FC<ZonaDoble & {en: number; ordena: number}> = ({y0, en, ordena}) => escenario(y0, <DemoCorreos en={en} ordena={ordena} />);
const UsoFactura: React.FC<ZonaDoble & {en: number; datos: number; nombre: number}> = ({y0, en, datos, nombre}) => escenario(y0, <DemoFactura en={en} datos={datos} nombre={nombre} />);
const UsoChat: React.FC<ZonaDoble & {en: number; cliente: number; responde: number; web: number; logo: string}> = ({y0, logos, en, cliente, responde, web, logo}) =>
	escenario(y0, <DemoChat en={en} cliente={cliente} responde={responde} web={web} logo={logos[logo]} />);

// ---------------------------------------------------------------------------------------------------------------
// Ventajas: «el más rápido y más barato». Dos tarjetas, cada una con su esfera: la de la velocidad sube hasta el
// máximo y la del precio baja hasta el mínimo. Cada tarjeta entra en su «más» y su palabra, cuando se dice.
type Ventaja = {entra: number; en: number};
const ARCO = 2 * Math.PI * 58;
const Esfera: React.FC<{p: number; color: string; icono: string; lit: boolean}> = ({p, color, icono, lit}) => (
	<div style={{position: 'relative', width: 150, height: 150}}>
		<svg width={150} height={150} viewBox="0 0 150 150" style={{position: 'absolute', left: 0, top: 0, transform: 'rotate(135deg)'}}>
			<circle cx={75} cy={75} r={58} fill="none" stroke={C.line2} strokeWidth={13} strokeLinecap="round" strokeDasharray={`${ARCO * 0.75} ${ARCO}`} />
			<circle cx={75} cy={75} r={58} fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeDasharray={`${Math.max(0.001, ARCO * 0.75 * p)} ${ARCO}`} style={{filter: `drop-shadow(0 0 10px ${color})`}} />
		</svg>
		<div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
			<Ico nombre={icono} size={58} color={lit ? color : C.muted} grosor={2.2} />
		</div>
	</div>
);
const Ventajas: React.FC<{i: number; f: number; rapido: Ventaja; barato: Ventaja; pie?: string; salida?: number}> = ({i, f, rapido, barato, pie, salida = 0.18}) => {
	const {t, fps} = useT();
	if (t < i || t >= f) return null;
	const s = 1 - rampa(t, f - salida, f);
	const tarjeta = (k: number, v: Ventaja, palabra: string, icono: string, color: string, sube: boolean) => {
		if (t < v.entra) return null;
		const e = resorte(t, v.entra, fps, {damping: 17, stiffness: 190});
		const l = enciende(t, v.en, fps);
		const mov = entraSale(rampa(t, v.en - 0.04, v.en + 0.5));
		const p = sube ? 0.12 + 0.88 * mov : 1 - 0.9 * mov;
		return (
			<div
				style={{
					position: 'absolute',
					left: ZONA.x + k * 472,
					top: ZONA.top,
					width: 448,
					height: 300,
					boxSizing: 'border-box',
					borderRadius: 28,
					background: l > 0.5 ? D.tarjetaSel : D.tarjeta,
					border: `1.5px solid ${l > 0.5 ? D.bordeSel : D.bordeVideo}`,
					boxShadow: l > 0.5 ? `${D.sombraSel}, ${D.sombraVideo}` : D.sombraVideo,
					opacity: Math.min(1, e * 1.5) * s,
					transform: `translateY(${(1 - e) * 44}px)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<div style={{marginTop: 22}}>
					<Esfera p={p} color={color} icono={icono} lit={l > 0.5} />
				</div>
				<span style={{marginTop: 2, ...rotulo(28, {color: C.muted, letterSpacing: '.16em'})}}>EL MÁS</span>
				<span style={{marginTop: 6, ...titular(64, {color: C.text}), opacity: clamp01(l * 2), transform: `scale(${0.82 + 0.18 * clamp01(l)})`}}>{palabra}</span>
			</div>
		);
	};
	const lp = rampa(t, rapido.entra + 0.25, rapido.entra + 0.55);
	return (
		<>
			{tarjeta(0, rapido, 'RÁPIDO', 'rayo', C.blue, true)}
			{tarjeta(1, barato, 'BARATO', 'dinero', C.green, false)}
			{pie ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: ZONA.top + 316, display: 'flex', justifyContent: 'center', opacity: lp * s}}>
					<span style={{padding: '8px 22px', borderRadius: 999, background: 'rgba(9,13,20,.88)', border: `1.5px solid ${C.line2}`, display: 'inline-flex'}}>
						<Pie texto={pie} style={{color: '#c3cad6'}} />
					</span>
				</div>
			) : null}
		</>
	);
};

// ---------------------------------------------------------------------------------------------------------------
// Precio: una ficha del modelo. Primero dos barras: la de la velocidad se llena del todo («el más rápido») y la del
// precio se queda en una décima parte («hasta un 90 % menos»; el hueco que deja es el precio del anterior).
// En "relevo", lo de dentro cambia: 100 monedas frente a 1 («100 veces menos que…»).
const MONEDA_AZUL = 'linear-gradient(135deg,#d6e5ff,#6ea3ff)';
const MONEDA_PLATA = 'linear-gradient(135deg,#eef2f8,#aab4c8)';
const EPS = 0.002;
const Precio: React.FC<{
	i: number;
	f: number;
	nombre: string;
	anterior: string;
	caro: string;
	rapido: En;
	cuesta: En;
	hasta: En;
	baja: En;
	antes: En;
	relevo: number;
	cien: En;
	fable: En;
	pie?: string;
	logos: Logos;
	salida?: number;
}> = ({i, f, nombre, anterior, caro, rapido, cuesta, hasta, baja, antes, relevo, cien, fable, pie, logos, salida}) => {
	const {t, fps} = useT();
	const lr = enciende(t, rapido.en, fps);
	const llena = entraSale(rampa(t, rapido.en - 0.04, rapido.en + 0.42));
	const lc = enciende(t, cuesta.en, fps);
	const lh = enciende(t, hasta.en, fps);
	const cae = entraSale(rampa(t, baja.en - 0.02, baja.en + 0.55));
	const ln = resorte(t, baja.en - 0.04, fps, {damping: 14, stiffness: 190});
	const la = enciende(t, antes.en, fps);
	const B = t >= relevo - EPS;
	const eb = resorte(t, relevo, fps, {damping: 18, stiffness: 190});
	const l100 = resorte(t, cien.en - 0.04, fps, {damping: 14, stiffness: 190});
	const lf = enciende(t, fable.en, fps);
	const pista = (y: number): React.CSSProperties => ({position: 'absolute', left: 40, top: y, width: 800, height: 40, borderRadius: 14, background: '#0a0e15', border: `1.5px solid ${C.line2}`, boxSizing: 'border-box'});
	const crece = clamp01(resorte(t, hasta.en - 0.14, fps, {damping: 22, stiffness: 190}));
	const N = 10;
	const PASO = 25;
	return (
		<Ficha i={i} f={f} alto={352 + 104 * crece} salida={salida}>
			<Cabecera logo={logos.claude} titulo={nombre} />
			{!B ? (
				<>
					<span style={{position: 'absolute', left: 40, top: 110, ...rotulo(26, {color: lr > 0.5 ? C.blue : D.tituloOff})}}>VELOCIDAD</span>
					<span style={{position: 'absolute', right: 80, top: 108, ...tituloFicha(28, {letterSpacing: '.06em'}), opacity: clamp01(lr * 2), transform: `scale(${latido(lr, 0.07)})`, transformOrigin: '100% 50%'}}>EL MÁS RÁPIDO</span>
					<div style={pista(148)} />
					<div style={{position: 'absolute', left: 40, top: 148, width: 800 * llena, height: 40, borderRadius: 14, background: `linear-gradient(90deg, ${C.blue2}, ${C.blue})`, boxShadow: `0 0 30px -8px ${acento(0.85)}`}} />

					<span style={{position: 'absolute', left: 40, top: 212, ...rotulo(26, {color: lc > 0.5 ? C.blue : D.tituloOff})}}>PRECIO</span>
					<span style={{position: 'absolute', right: 80, top: 210, ...tituloFicha(28, {letterSpacing: '.06em', color: '#c3cad6'}), opacity: clamp01(la * 2), transform: `scale(${latido(la, 0.07)})`, transformOrigin: '100% 50%'}}>{anterior}</span>
					<div style={pista(250)} />
					<div style={{position: 'absolute', left: 40, top: 250, width: 800 * (1 - 0.9 * cae), height: 40, borderRadius: 14, background: cae > 0.5 ? `linear-gradient(90deg, #1fa37a, ${C.green})` : 'linear-gradient(90deg, #5d6b82, #8493ab)', boxShadow: cae > 0.5 ? '0 0 30px -6px rgba(52,211,153,.8)' : 'none', opacity: clamp01(lc * 2)}} />

					<div style={{position: 'absolute', left: 40, top: 306, height: 92, display: 'flex', alignItems: 'center', gap: 22}}>
						<span style={{...rotulo(30, {color: C.muted}), opacity: clamp01(lh * 2)}}>HASTA</span>
						<span style={{...titular(92, {color: C.green, textShadow: '0 0 44px rgba(52,211,153,.35)'}), opacity: clamp01(ln * 2), transform: `scale(${0.7 + 0.3 * ln})`, transformOrigin: '0 50%'}}>−90 %</span>
					</div>
				</>
			) : (
				<div style={{position: 'absolute', inset: 0, opacity: clamp01(eb * 1.6), transform: `translateY(${(1 - eb) * 22}px)`}}>
					<span style={{position: 'absolute', left: 40, width: 220, top: 108, textAlign: 'center', ...tituloFicha(28, {letterSpacing: '.06em'})}}>{nombre}</span>
					<div style={{position: 'absolute', left: 150 - 46, top: 216, width: 92, height: 92, borderRadius: '50%', background: MONEDA_AZUL, border: '4px solid #2f6fe8', boxSizing: 'border-box', boxShadow: `0 0 44px -6px ${acento(0.9)}`}}>
						<div style={{position: 'absolute', inset: 9, borderRadius: '50%', border: '3px solid rgba(47,111,232,.55)'}} />
					</div>
					<span style={{position: 'absolute', left: 266, width: 270, top: 212, textAlign: 'center', ...titular(100, {color: C.text}), opacity: clamp01(l100 * 2), transform: `scale(${0.7 + 0.3 * l100})`}}>
						<span style={{color: C.blue}}>×</span>100
					</span>
					<span style={{position: 'absolute', left: 548, width: N * PASO, top: 108, textAlign: 'center', ...tituloFicha(28, {letterSpacing: '.06em', color: lf > 0.5 ? C.text : D.tituloOff}), transform: `scale(${latido(lf, 0.08)})`}}>{caro}</span>
					{Array.from({length: N * N}).map((_, k) => {
						const on = t >= cien.en + k * 0.006;
						return (
							<div
								key={k}
								style={{
									position: 'absolute',
									left: 548 + (k % N) * PASO,
									top: 150 + Math.floor(k / N) * PASO,
									width: 20,
									height: 20,
									borderRadius: '50%',
									boxSizing: 'border-box',
									background: on ? MONEDA_PLATA : '#0f141d',
									border: `1.5px solid ${on ? '#6b778c' : C.line2}`,
								}}
							/>
						);
					})}
				</div>
			)}
			{pie ? <Pie texto={pie} style={{position: 'absolute', left: 40, bottom: 18}} /> : null}
		</Ficha>
	);
};

// ---------------------------------------------------------------------------------------------------------------
// Prueba: «manejando un ordenador él solo». Primero una ventana en la que el cursor va solo hasta el botón y lo
// pulsa; en "relevo", el resultado: dos barras sobre 100, la del modelo anterior y la del nuevo.
const Prueba: React.FC<{
	i: number;
	f: number;
	titulo: string;
	raton: {en: number; clic: number};
	solo: En;
	relevo: number;
	antes: En & {nombre: string; valor: number; nombreEn: number};
	ahora: En & {nombre: string; valor: number; nombreEn: number};
	cien: En;
	total: string;
	pie?: string;
	salida?: number;
}> = ({i, f, titulo, raton, solo, relevo, antes, ahora, cien, total, pie, salida}) => {
	const {t, fps} = useT();
	const ls = enciende(t, solo.en, fps);
	const va = entraSale(rampa(t, raton.en, raton.clic - 0.06));
	const pulsa = t >= raton.clic;
	const onda = rampa(t, raton.clic, raton.clic + 0.4);
	const B = t >= relevo;
	const eb = resorte(t, relevo, fps, {damping: 18, stiffness: 190});
	const lA = enciende(t, antes.nombreEn, fps);
	const pA = sale(rampa(t, antes.en - 0.03, antes.en + 0.4));
	const lN = enciende(t, ahora.nombreEn, fps);
	const pN = sale(rampa(t, ahora.en - 0.03, ahora.en + 0.5));
	const golpe = pulso(t - ahora.en, 0.08, 0.16);
	const lC = enciende(t, cien.en, fps);
	const PX = 250;
	const PW = 450;
	const fila = (y: number, nombre: string, lit: number, p: number, valor: number, propio: boolean) => (
		<>
			<span style={{position: 'absolute', left: 40, top: y + 3, ...tituloFicha(28, {letterSpacing: '.06em', lineHeight: '34px', color: lit > 0.5 ? C.text : D.tituloOff})}}>{nombre}</span>
			<div style={{position: 'absolute', left: PX, top: y, width: PW, height: 40, borderRadius: 14, background: '#0a0e15', border: `1.5px solid ${C.line2}`, boxSizing: 'border-box'}} />
			<div style={{position: 'absolute', left: PX, top: y, width: (PW * valor * p) / 100, height: 40, borderRadius: 14, background: propio ? `linear-gradient(90deg, ${C.blue2}, ${C.blue})` : 'linear-gradient(90deg, #5d6b82, #8493ab)', boxShadow: propio && p > 0.5 ? `0 0 34px -6px ${acento(0.9)}` : 'none'}} />
			<span style={{position: 'absolute', left: PX + PW + 26, top: y - 14, ...titular(68, {color: propio ? C.text : '#c3cad6', lineHeight: '68px'}), opacity: clamp01(p * 3), transform: `scale(${propio ? 1 + 0.1 * golpe : 1})`, transformOrigin: '0 50%'}}>{valor}</span>
		</>
	);
	// el cursor va solo hasta el botón (px de la ventana)
	const cx = 110 + (640 - 110) * va;
	const cy = 64 + (216 - 64) * va - 36 * Math.sin(Math.PI * va);
	return (
		<Ficha i={i} f={f} alto={404} salida={salida}>
			<Cabecera
				icono="monitor"
				titulo={titulo}
				derecha={
					<span style={{display: 'inline-flex', opacity: clamp01(ls * 2), transform: `scale(${0.8 + 0.2 * clamp01(ls)})`, transformOrigin: '100% 50%'}}>
						<Chip texto="ÉL SOLO" estado="green" />
					</span>
				}
			/>
			{!B ? (
				<div style={{position: 'absolute', left: 40, top: 110, width: 800, height: 270, borderRadius: 20, background: '#0b1017', border: `1.5px solid ${C.line2}`, overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 44, background: '#0f141d', borderBottom: `1.5px solid ${C.line2}`, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 18}}>
						{[0, 1, 2].map((k) => (
							<span key={k} style={{width: 12, height: 12, borderRadius: '50%', background: C.line2}} />
						))}
					</div>
					<div style={{position: 'absolute', left: 28, top: 70, ...barra(200, 16, '#283246')}} />
					<div style={{position: 'absolute', left: 28, top: 106, width: 480, height: 46, borderRadius: 12, background: '#111824', border: `1.5px solid ${C.line2}`, boxSizing: 'border-box'}}>
						<div style={{position: 'absolute', left: 16, top: 16, ...barra(300 * clamp01(va * 1.6), 12, '#4a5a76')}} />
					</div>
					<div style={{position: 'absolute', left: 28, top: 170, width: 480, height: 46, borderRadius: 12, background: '#111824', border: `1.5px solid ${C.line2}`, boxSizing: 'border-box'}}>
						<div style={{position: 'absolute', left: 16, top: 16, ...barra(220 * clamp01(va * 1.6 - 0.5), 12, '#4a5a76')}} />
					</div>
					<div style={{position: 'absolute', left: 540, top: 168, width: 220, height: 64, borderRadius: 16, display: 'grid', placeItems: 'center', background: pulsa ? `linear-gradient(180deg, ${C.blue}, ${C.blue2})` : '#161d2a', border: `1.5px solid ${pulsa ? C.blue3 : C.line2}`, boxShadow: pulsa ? `0 0 40px -8px ${acento(0.9)}` : 'none', boxSizing: 'border-box'}}>
						<span style={{fontFamily: SANS, fontSize: 28, fontWeight: 800, color: pulsa ? '#fff' : C.muted}}>{pulsa ? 'Enviado' : 'Enviar'}</span>
					</div>
					{pulsa && onda < 1 ? <div style={{position: 'absolute', left: 650 - 60 - 60 * onda, top: 200 - 60 - 60 * onda, width: 120 + 120 * onda, height: 120 + 120 * onda, borderRadius: '50%', border: `3px solid ${C.blue3}`, opacity: 1 - onda}} /> : null}
					<svg width={46} height={46} viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cy, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.7))', transform: `scale(${pulsa && onda < 0.4 ? 0.88 : 1})`, transformOrigin: '20% 10%'}}>
						<path d="M5 3l14 8.2-6.2 1.6L11 19z" fill="#fff" stroke="#0b1017" strokeWidth={1.4} strokeLinejoin="round" />
					</svg>
				</div>
			) : (
				<div style={{position: 'absolute', inset: 0, opacity: clamp01(eb * 1.6), transform: `translateY(${(1 - eb) * 22}px)`}}>
					{fila(124, antes.nombre, lA, pA, antes.valor, false)}
					{fila(214, ahora.nombre, lN, pN, ahora.valor, true)}
					<div style={{position: 'absolute', left: PX + PW - 1, top: 112, width: 2, height: 156, background: lC > 0.5 ? '#8493ab' : C.line2}} />
					<span style={{position: 'absolute', left: PX, width: PW, top: 280, textAlign: 'right', ...cuerpo(26, {color: lC > 0.5 ? '#c3cad6' : C.dim})}}>{total}</span>
				</div>
			)}
			{pie && B ? <Pie texto={pie} style={{position: 'absolute', left: 40, bottom: 18, opacity: clamp01(eb * 1.6)}} /> : null}
		</Ficha>
	);
};

// ---------------------------------------------------------------------------------------------------------------
// Recado (cuerpo de escena): «es como ir a por el pan: no sacas el camión, coges la moto». Dos carriles hacia la
// panadería: en el de arriba, el camión se queda con su aspa; en el de abajo, la moto sale y llega. Después la
// moto recibe el nombre del modelo.
const Moto: React.FC<{w: number; color: string}> = ({w, color}) => (
	<svg width={w} height={(w * 64) / 100} viewBox="0 0 100 64" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
		<g fill={acento(0.2)}>
			<path d="M10 42C10 28 19 23 30 23H47C51 23 53 26 54 30L57 45H36C35 39 29 35 22 35C17 35 13 38 10 42Z" />
			<rect x="17" y="14.5" width="30" height="8.5" rx="4" />
			<path d="M66 47 72 15H79L76 31C75 37 73 43 72 47Z" />
		</g>
		<path d="M57 45H67" strokeWidth={4.4} />
		<path d="M68 11.5H83" strokeWidth={4} />
		<path d="M77 29 81 51" />
		<circle cx="22" cy="51" r="10" fill="#0b1017" />
		<circle cx="81" cy="51" r="10" fill="#0b1017" />
		<circle cx="22" cy="51" r="2.6" fill={color} stroke="none" />
		<circle cx="81" cy="51" r="2.6" fill={color} stroke="none" />
		<circle cx="81.5" cy="20" r="2.8" fill="#fff" stroke="none" />
	</svg>
);
const Recado: React.FC<Zona & {camino: En; pan: En; camion: En; no: En; carril: En; moto: En; haiku: En; es: En; nombre: string}> = ({y0, y1, logos, camino, pan, camion, no, carril, moto, haiku, es, nombre}) => {
	const {t, fps} = useT();
	const X = ESCENA.izq;
	const AN = ESCENA.der - ESCENA.izq; // 936
	const H1 = 270; // tarjeta del camión
	const SEP = 26;
	const yT = y0 + 6;
	const yR = yT + H1 + SEP;
	const H2 = y1 - 6 - yR; // tarjeta del recado
	const SUELO = H2 - 86;
	const lr = resorte(t, camino.en - 0.04, fps, {damping: 18, stiffness: 180});
	const traza = sale(rampa(t, camino.en + 0.05, camino.en + 0.6));
	const lp = resorte(t, pan.en - 0.04, fps, {damping: 15, stiffness: 190});
	const lc = resorte(t, camion.en - 0.04, fps, {damping: 17, stiffness: 180});
	const ln = resorte(t, no.en - 0.04, fps, {damping: 13, stiffness: 230});
	const atenua = rampa(t, carril.en, carril.en + 0.3);
	const lm = resorte(t, moto.en - 0.04, fps, {damping: 16, stiffness: 200});
	const corre = entraSale(rampa(t, moto.en + 0.04, moto.en + 0.68));
	const llega = resorte(t, moto.en + 0.62, fps, {damping: 14, stiffness: 210});
	const lh = resorte(t, haiku.en - 0.04, fps, {damping: 15, stiffness: 200});
	const golpe = pulso(t - es.en, 0.08, 0.18);
	const MW = 290;
	const MH = (MW * 61) / 100; // de arriba hasta el apoyo de las ruedas
	const mx = 44 + (590 - MW - 44) * corre;
	const veloz = Math.sin(Math.PI * corre);
	const TW = 250;
	const PX = 608; // la panadería, dentro de la tarjeta del recado
	const tarjeta = (y: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: X, top: y, width: AN, height: h, boxSizing: 'border-box', borderRadius: 30, background: D.tarjeta, border: `1.5px solid ${C.line2}`, ...extra});
	return (
		<>
			{/* el camión: se queda */}
			{t >= camion.en - 0.04 ? (
				<div style={{...tarjeta(yT, H1), opacity: clamp01(lc * 1.6) * (1 - 0.5 * atenua), transform: `translateY(${(1 - lc) * -26}px)`}}>
					<div style={{position: 'absolute', left: 40, top: H1 - 44, width: 560, height: 4, borderRadius: 2, background: C.line2}} />
					<svg width={TW} height={TW} viewBox="0 0 24 24" fill="none" stroke={atenua > 0.5 ? C.muted : C.text} strokeWidth={1.35} strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', left: 56, top: H1 - 44 - TW * 0.84}}>
						<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
						<path d="M15 18H9" />
						<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
						<circle cx="17" cy="18" r="2" />
						<circle cx="7" cy="18" r="2" />
					</svg>
					{t >= no.en - 0.04 ? (
						<div style={{position: 'absolute', left: AN - 236, top: H1 / 2 - 59, width: 118, height: 118, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `linear-gradient(${ESTADO.red.fondo}, ${ESTADO.red.fondo}), ${C.bg}`, border: `3px solid ${C.red}`, boxSizing: 'border-box', opacity: clamp01(ln * 2), transform: `scale(${0.5 + 0.5 * ln})`}}>
							<Ico nombre="x" size={66} color={C.red} grosor={3} />
						</div>
					) : null}
				</div>
			) : null}
			{/* el recado: la calle, la panadería y la moto */}
			{t >= camino.en - 0.04 ? (
				<div style={{...tarjeta(yR, H2, llega > 0.5 ? {background: D.tarjetaSel, border: `1.5px solid ${D.bordeSel}`, boxShadow: D.sombraSel} : {}), opacity: clamp01(lr * 1.6), transform: `translateY(${(1 - lr) * 30}px)`}}>
					<div style={{position: 'absolute', left: 40, top: SUELO, width: (PX - 40) * traza, height: 4, borderRadius: 2, background: lm > 0.5 ? '#3a4a66' : C.line2}} />
					<div style={{position: 'absolute', left: PX, top: SUELO - 300, width: 260, height: 304, boxSizing: 'border-box', borderRadius: 26, background: llega > 0.5 ? `linear-gradient(${ESTADO.green.fondo}, ${ESTADO.green.fondo}), ${D.hueco}` : D.hueco, border: `1.5px solid ${llega > 0.5 ? ESTADO.green.borde : 'rgba(243,245,249,.22)'}`, opacity: clamp01(lp * 1.6), transform: `scale(${0.8 + 0.2 * lp})`, transformOrigin: '50% 100%'}}>
						<svg width={150} height={150} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', left: 55, top: 26}}>
							<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
							<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
							<path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
							<path d="M2 7h20" />
							<path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
						</svg>
						<span style={{position: 'absolute', left: 0, right: 0, top: 196, textAlign: 'center', ...titular(76, {color: C.text})}}>PAN</span>
					</div>
					{t >= moto.en - 0.04 ? (
						<>
							{[0, 1, 2].map((k) => (
								<div key={k} style={{position: 'absolute', left: mx - 76 - k * 14, top: SUELO - 150 + k * 44, width: 56 + k * 16, height: 5, borderRadius: 3, background: C.blue3, opacity: 0.8 * veloz}} />
							))}
							<div style={{position: 'absolute', left: mx, top: SUELO - MH + 2, opacity: clamp01(lm * 2), transform: `scale(${1 + 0.07 * golpe})`, transformOrigin: '50% 100%', filter: `drop-shadow(0 0 18px ${acento(0.7)})`}}>
								<Moto w={MW} color={C.blue3} />
							</div>
							<div style={{position: 'absolute', left: PX + 130 - 38, top: SUELO - 300 - 38, opacity: clamp01(llega * 2), transform: `scale(${0.5 + 0.5 * llega})`}}>
								<div style={{borderRadius: '50%', background: C.bg}}>
									<Cerrojo size={76} on={llega} trazo={rampa(t, moto.en + 0.64, moto.en + 0.9)} />
								</div>
							</div>
						</>
					) : null}
					{t >= haiku.en - 0.04 ? (
						<div style={{position: 'absolute', left: mx - 6, top: SUELO - MH - 112, opacity: clamp01(lh * 2), transform: `translateY(${(1 - lh) * 20}px) scale(${1 + 0.06 * golpe})`, transformOrigin: '30% 100%'}}>
							<Pastilla texto={nombre} alto={86} tam={36} logo={logos.claude} on={1} azul />
						</div>
					) : null}
				</div>
			) : null}
		</>
	);
};

export const CARA: Record<string, React.FC<any>> = {ventajas: Ventajas, precio: Precio, prueba: Prueba};
export const ESCENAS: Record<string, React.FC<any>> = {};
export const CUERPOS: Record<string, React.FC<any>> = {recado: Recado};
export const DOBLES: Record<string, React.FC<any>> = {pdf: UsoPdf, correos: UsoCorreos, factura: UsoFactura, chat: UsoChat};

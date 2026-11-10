import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {C, S, V} from '../tema';
import {CLAMP, useT} from '../componentes/comun';
import {PaginaPro, Seccion} from './tipos';
import {HUD, SANS, SUBS, TXT, rampa, resorte, tituloFicha} from './sistema';

const ACENTO_ACTIVA = V.acento; // el coral claro: se lee mejor sobre el vídeo

// Subtítulos: frases cortas siempre en el mismo sitio; la palabra que suena va en el color de acento y da un salto
// pequeño. Más pequeños que los gráficos: mandan las piezas, el subtítulo acompaña.
// Una página "grande" (primer plano sin pieza) sube lo justo para acabar por encima de la interfaz de Instagram.
// En el tema claro, sobre una escena (fondo marfil), van en noche con trazo marfil.
export const SubtitulosPro: React.FC<{paginas: PaginaPro[]; sobreClaro?: (t: number) => boolean}> = ({paginas, sobreClaro}) => {
	const {t, fps} = useT();
	const pag = paginas.find((p) => t >= p.i && t < p.f);
	if (!pag) return null;
	const tam = pag.tam ?? SUBS.tam;
	const alto = pag.lineas.length * tam * 1.1 + 2;
	const top = Math.min(SUBS.top, SUBS.fondo - alto);
	const e = resorte(t, pag.i, fps, {damping: 22, stiffness: 340, mass: 0.5});
	const claro = sobreClaro ? sobreClaro(t) : false;
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 40,
				right: 40,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
				fontFamily: SANS,
				transform: `translateY(${(1 - e) * 14}px)`,
				opacity: Math.min(1, e * 2),
			}}
		>
			{pag.lineas.map((linea, li) => (
				<div key={li} style={{display: 'flex', gap: tam * 0.3, justifyContent: 'center'}}>
					{linea.map((w, wi) => {
						const activa = t >= w.i - 0.03 && t < w.f - 0.03;
						// salto pequeño y que vuelve a su sitio; en una palabra larga, menor, para que no se coma el hueco con la de al lado
						const fuerza = 0.05 * Math.min(1, 7 / Math.max(1, w.t.length));
						const salto = activa ? interpolate(t - w.i, [0, 0.085, 0.235], [1, 1 + fuerza, 1], CLAMP) : 1;
						return (
							<span
								key={wi}
								style={{
									display: 'inline-block',
									fontSize: tam,
									fontWeight: 800,
									lineHeight: 1.1,
									letterSpacing: '-.005em',
									color: activa || w.d ? (claro ? C.blue : ACENTO_ACTIVA) : claro ? C.text : V.texto, // tipo oración, tal como se escribe
									transform: `scale(${salto})`,
									WebkitTextStroke: `${Math.round(tam * 0.11)}px ${claro ? 'rgba(245,237,229,.7)' : V.trazo(0.5)}`,
									paintOrder: 'stroke fill',
									textShadow: claro ? 'none' : '0 5px 22px rgba(10,18,21,.7), 0 2px 4px rgba(10,18,21,.6)',
								}}
							>
								{w.t}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

// Pastillas de arriba (capítulo y logo): del color del tema, como las tarjetas
const CHIP = (): React.CSSProperties => ({
	position: 'absolute',
	top: HUD.y - 2,
	height: 84,
	boxSizing: 'border-box',
	display: 'flex',
	alignItems: 'center',
	borderRadius: 22,
	background: S.velo,
	border: `1.5px solid ${C.line2}`,
	boxShadow: `0 20px 50px -22px ${S.sombra(0.85)}`,
});

// Capítulo arriba a la izquierda: "01 PROGRAMACIÓN". Dice en qué parte del vídeo estamos.
// Si un capítulo empieza donde acaba otro, la pastilla se queda y solo cambia lo de dentro (sin quedarse vacía).
export const Capitulo: React.FC<{secciones: Seccion[]}> = ({secciones}) => {
	const {t, fps} = useT();
	const sec = secciones.find((s) => t >= s.i && t < s.f);
	if (!sec) return null;
	const e = resorte(t, sec.i, fps, {damping: 19, stiffness: 200});
	const sal = 1 - rampa(t, sec.f - 0.18, sec.f);
	const sigue = secciones.some((s) => s !== sec && Math.abs(s.f - sec.i) < 0.05);
	const siguiente = secciones.some((s) => s !== sec && Math.abs(s.i - sec.f) < 0.05);
	const cont = sigue ? 1 : e;
	const dentro: React.CSSProperties = {transform: `translateY(${(1 - e) * 16}px)`, opacity: Math.min(1, (sigue ? 0.35 : 0) + e * 1.6)};
	// Con "tituloEn", hasta esa palabra solo se ve el número («03») y la pastilla se abre para enseñar el título
	// cuando se dice (no se adelanta a la voz: «TERCERO, lo que les vuela la cabeza» no destripa «WHATSAPP»).
	const abre = sec.tituloEn === undefined ? 1 : t < sec.tituloEn - 0.05 ? 0 : resorte(t, sec.tituloEn - 0.05, fps, {damping: 18, stiffness: 200});
	const ab = Math.max(0, Math.min(1, abre));
	return (
		<div style={{...CHIP(), left: HUD.x, gap: 0, padding: `0 ${20 + 6 * ab}px 0 20px`, transform: `translateX(${(1 - cont) * -80}px)`, opacity: Math.min(1, cont * 1.5) * (siguiente ? 1 : sal)}}>
			<span style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, letterSpacing: '-.03em', color: C.blue, ...dentro}}>{sec.num}</span>
			<div style={{display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16 * ab, maxWidth: 460 * ab, overflow: 'hidden', opacity: Math.min(1, ab * 1.6)}}>
				<span style={{width: 1.5, height: 40, background: C.line2, flex: '0 0 auto'}} />
				<span style={{...tituloFicha(TXT.min, {letterSpacing: '.14em'}), ...dentro}}>{sec.titulo}</span>
			</div>
		</div>
	);
};

// El logo de la marca, siempre arriba a la derecha
export const LogoMarca: React.FC<{src?: string; desde?: number}> = ({src, desde = 0}) => {
	const {t, fps} = useT();
	if (!src || t < desde) return null;
	const e = desde < 0.05 ? 1 : resorte(t, desde, fps, {damping: 19, stiffness: 200});
	return (
		<div style={{...CHIP(), right: HUD.x, padding: '0 18px', transform: `translateX(${(1 - e) * 80}px)`, opacity: Math.min(1, e * 1.5)}}>
			<Img src={staticFile(src)} style={{display: 'block', height: 56, objectFit: 'contain'}} />
		</div>
	);
};

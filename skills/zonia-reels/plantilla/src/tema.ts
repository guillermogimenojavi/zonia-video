import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import marca from './marca.json';

// La marca (colores, tema y logo) sale de marca.json, que se copia desde la raíz del proyecto al preparar.
// Por defecto es zonia, con dos temas: "oscuro" (fondo noche #1F1A17, texto marfil) y "claro" (fondo marfil
// #FBF4E7, texto noche). El coral teja #DF663F es el acento en los dos. Cada reel elige el suyo con "tema" en el
// guion; sin él, manda "tema" de marca.json. Lo que va directamente sobre la grabación (subtítulos, titulares
// sueltos) no cambia con el tema: siempre marfil con un trazo noche, para que se lea sobre cualquier imagen.
type Colores = typeof marca.colores;
export type NombreTema = 'oscuro' | 'claro';
const TEMAS: Record<NombreTema, Colores> = {
	oscuro: marca.colores,
	claro: (marca as {colores_claro?: Colores}).colores_claro ?? marca.colores,
};
const DEFECTO: NombreTema = (marca as {tema?: string}).tema === 'claro' ? 'claro' : 'oscuro';
let k: Colores = TEMAS[DEFECTO];
let actual: NombreTema = DEFECTO;
export const temaActual = () => actual;

const rgb = (hex: string) => {
	const n = parseInt(hex.replace('#', ''), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const rgba = (hex: string, a: number) => {
	const [r, g, b] = rgb(hex);
	return `rgba(${r},${g},${b},${a})`;
};

// Los nombres (blue...) se mantienen por compatibilidad: "blue" es siempre el color de acento de la marca.
export const C = {
	bg: '', line: '', line2: '', text: '', muted: '', dim: '',
	blue: '', blue2: '', blue3: '', green: '', amber: '', red: '',
	card: '', icoBg: '', icoBorde: '',
};
// Superficies y tonos que dependen del tema (lo que antes eran colores fijos repartidos por las piezas)
export const S = {
	claro: false,
	hueco: '', // paneles dentro de una tarjeta
	pastilla: '', // pastillas y huecos encendidos
	pastillaOff: '', // pastillas que esperan apagadas
	velo: '', // píldoras semitransparentes (capítulo, logo, etiquetas sobre la escena)
	textoSec: '', // texto secundario dentro de una tarjeta
	textoPie: '', // fuentes y notas pequeñas
	bordeOn: '', // borde de algo encendido que no es el acento
	bordeSuave: '',
	bordeLogo: '',
	sombra: (o: number) => `rgba(12,9,7,${o})`, // sombras de tarjetas
	filo: ['', ''], // filo de luz de la cortina y de la costura de la doble pantalla
	resplandor: '', // fondo de las escenas
	ventanaBarra: '',
	ventanaCampo: '',
	monedaCara: ['', ''],
	monedaCanto: ['', '', ''],
	monedaTexto: '',
	barraNeutra: '',
};
// Sobre la grabación, en los dos temas
export const V = {
	texto: '#FBF4E7',
	fondo: '#1F1A17', // píldora clara sobre la grabación: marfil con texto noche
	trazo: (a: number) => `rgba(31,26,23,${a})`,
	acento: '#F0A07A', // el coral claro: se lee mejor sobre el vídeo
	sobreAcento: '#FBF4E7', // texto dentro de una caja de acento
};

export const acento = (a: number) => rgba(k.acento, a);
export const acento2 = (a: number) => rgba(k.acento2, a);
export const fondo = (a: number) => rgba(k.fondo, a);
export const texto = (a: number) => rgba(k.texto, a);
// Lo que rodea la grabación (relleno, oscurecidos de arriba y abajo) es siempre noche, en los dos temas:
// los subtítulos marfil tienen que leerse encima.
export const fondoVideo = (a: number) => `rgba(31,26,23,${a})`;
// Tarjeta "encendida" (seleccionada): la tarjeta normal con un velo del color de acento
export let tarjetaActiva = '';

export const COLOR_ESTADO = {blue: '', green: '', amber: '', red: ''};

const calcular = () => {
	const claro = actual === 'claro';
	Object.assign(C, {
		bg: k.fondo,
		line: k.borde,
		line2: k.borde2,
		text: k.texto,
		muted: k.suave,
		dim: k.tenue,
		blue: k.acento,
		blue2: k.acento2,
		blue3: claro ? k.acento2 : k.acento3, // acento para texto: más claro sobre oscuro, más oscuro sobre marfil
		green: k.ok,
		amber: k.aviso,
		red: k.error,
		card: `linear-gradient(180deg,${k.tarjeta[0]},${k.tarjeta[1]})`,
		icoBg: rgba(k.acento, claro ? 0.1 : 0.12),
		icoBorde: rgba(k.acento, claro ? 0.35 : 0.3),
	});
	Object.assign(S, {
		claro,
		hueco: claro ? '#F2E4CC' : '#191512',
		pastilla: claro ? '#FFFDF8' : '#2A2320',
		pastillaOff: rgba(k.fondo, 0.6),
		velo: rgba(k.fondo, 0.9),
		textoSec: claro ? '#6B5345' : '#CDBFB0',
		textoPie: claro ? '#8C7360' : '#D3B38D',
		bordeOn: rgba(k.texto, claro ? 0.3 : 0.38),
		bordeSuave: rgba(k.texto, claro ? 0.16 : 0.22),
		bordeLogo: rgba(k.texto, claro ? 0.22 : 0.3),
		sombra: claro ? (o: number) => `rgba(31,26,23,${(o * 0.3).toFixed(3)})` : (o: number) => `rgba(12,9,7,${o})`,
		filo: claro ? ['#B89A78', '#6B5345'] : ['#B89A78', '#FBF4E7'],
		resplandor: claro
			? 'radial-gradient(1000px 900px at 0% 6%, rgba(255,255,255,.75), transparent 62%), radial-gradient(1000px 900px at 100% 8%, rgba(247,217,156,.2), transparent 60%)'
			: 'radial-gradient(1000px 900px at 0% 6%, rgba(107,82,51,.24), transparent 62%), radial-gradient(1000px 900px at 100% 8%, rgba(247,217,156,.08), transparent 60%)',
		ventanaBarra: claro ? '#F2E4CC' : '#191512',
		ventanaCampo: claro ? '#FFFDF8' : '#2A2320',
		// Monedas: la propia en acento liso (el acento nunca va en degradado); las demás, en arenas
		monedaCara: claro ? ['#F2E4CC', '#D3B38D'] : ['#F2E4CC', '#D3B38D'],
		monedaCanto: ['#8C7360', '#B89A78', '#6B5345'],
		monedaTexto: '#6B5345',
		barraNeutra: 'linear-gradient(180deg, #D3B38D 0%, #8C7360 34%, #6B5345 100%)',
	});
	tarjetaActiva = `linear-gradient(180deg, ${rgba(k.acento, 0.16)}, ${rgba(k.acento, 0.06)}), ${C.card}`;
	Object.assign(COLOR_ESTADO, {blue: C.blue, green: C.green, amber: C.amber, red: C.red});
};
calcular();

// Otros módulos (sistema.ts) recalculan sus tonos cuando cambia el tema
const oyentes: (() => void)[] = [];
export const alCambiarTema = (fn: () => void) => {
	oyentes.push(fn);
	fn();
};
// Se llama al principio de la composición con el "tema" del EDL. Sin tema, el de marca.json.
export const usarTema = (nombre?: string) => {
	const n: NombreTema = nombre === 'claro' ? 'claro' : nombre === 'oscuro' ? 'oscuro' : DEFECTO;
	if (n === actual) return;
	actual = n;
	k = TEMAS[n];
	calcular();
	oyentes.forEach((f) => f());
};

// Las tipografías de la marca zonia (las de zonia.space), en local: no hace falta internet para renderizar.
// Nunito (variable) en titulares, subtítulos y etiquetas, de 700 a 900; Geist en el texto corrido; Geist Mono en cifras.
export const fontFamily = 'Nunito';
export const fontTexto = 'Geist';
export const fontCifras = 'Geist Mono';
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
for (const [familia, archivo] of [['Nunito', 'nunito'], ['Geist', 'geist'], ['Geist Mono', 'geist-mono']]) {
	loadFont({family: familia, url: staticFile(`fonts/${archivo}-latin-wght-normal.woff2`), weight: '100 900', unicodeRange: LATIN});
	loadFont({family: familia, url: staticFile(`fonts/${archivo}-latin-ext-wght-normal.woff2`), weight: '100 900', unicodeRange: LATIN_EXT});
}

// Maqueta vertical 1080x1920 con las zonas seguras de Instagram:
// arriba ~220 px (cabecera de Reels), abajo ~360 px (usuario, texto, audio) y botones a la derecha.
export const ANCHO = 1080;
export const ALTO = 1920;
// La cara ocupa de y≈365 (cabeza) a y≈891 (barbilla): encuadre.py coloca el vídeo para que así sea.
export const ZONA = {top: 925, bottom: 1265, cx: 540, cy: 1095}; // gráficos, por debajo de la barbilla
export const SUBS_TOP = 1292; // subtítulos por debajo de los gráficos
export const ETIQUETA = {x: 56, y: 236}; // etiqueta de capítulo, arriba a la izquierda
export const HUECO_LOGO = 64; // hueco del logo dentro de la etiqueta
export const SLOT_LOGO = {x: ETIQUETA.x + 14 + HUECO_LOGO / 2, y: ETIQUETA.y + 14 + HUECO_LOGO / 2}; // su centro
// Pieza "pantalla" (grabaciones dobles): la tarjeta con el recorte de la pantalla ocupa la franja de la cara y
// de los gráficos, y la cara pasa a una burbuja arriba a la derecha, a la altura de la etiqueta.
export const PANTALLA = {top: 474, alto: 790, ancho: 960, burbuja: {x: 918, y: 348, d: 224}};

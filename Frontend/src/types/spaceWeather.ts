export type RiskLevel =
	| 'NORMAL'
	| 'WATCH'
	| 'ADVISORY'
	| 'WARNING'
	| 'CRITICAL';

export type InfrastructureType =
	| 'power_grid'
	| 'gnss'
	| 'telecommunications'
	| 'satellites'
	| 'aviation'
	| 'railways';

/* =========================
   RISK
========================= */

export interface RiskFactor {
	name: string;
	value: number | string | null;
	normalized_score: number;
	contribution: number;
	severity: string;
	available: boolean;
}

export interface InfrastructureRisk {
	infrastructure: InfrastructureType;
	score: number;
	level: RiskLevel;
	confidence: number;
	drivers: RiskFactor[];

	latitude: number | null;
	longitude: number | null;
}

export interface SpaceWeatherRisk {
	overall_score: number;
	overall_level: RiskLevel;
	confidence: number;
	infrastructure: InfrastructureRisk[];
	primary_drivers: RiskFactor[];
}

/* =========================
   SOLAR WIND
========================= */

export interface SolarWindHistory {
	time_tag: string | null;
	speed: number | null;
	density: number | null;
	temperature: number | null;
}

export interface BzHistory {
	time_tag: string | null;
	bz: number | null;
}

export interface SolarWindData {
	time_tag: string | null;

	speed: number | null;
	density: number | null;
	temperature: number | null;

	bx: number | null;
	by: number | null;
	bz: number | null;
	bt: number | null;

	history: SolarWindHistory[];

	bz_history: BzHistory[];
}

/* =========================
   GEOMAGNETIC
========================= */

export interface KpHistory {
	time_tag: string | null;
	kp: number | null;
}

export interface DstHistory {
	time_tag: string | null;
	dst: number | null;
}

export interface GeomagneticData {
	time_tag: string | null;

	kp: number | null;
	dst: number | null;

	kp_history: KpHistory[];
	dst_history: DstHistory[];
}

/* =========================
   SOLAR ACTIVITY
========================= */

export interface ProtonHistory {
	time_tag: string | null;
	value: number | null;
}

export interface XrayHistory {
	time_tag: string | null;
	value: number | null;
}

export interface SolarFlare {
	[key: string]: unknown;
}

export interface SolarActivityData {
	time_tag: string | null;

	xray_flux: number | null;
	flare_class: string | null;
	proton_flux: number | null;

	flares: SolarFlare[];

	proton_history: ProtonHistory[];

	xray_history: XrayHistory[];
}

/* =========================
   CURRENT SPACE WEATHER
========================= */

export interface SpaceWeatherCurrent {
	timestamp: string;

	geomagnetic: GeomagneticData;

	solar_wind: SolarWindData;

	solar_activity: SolarActivityData;

	risk: SpaceWeatherRisk;
}

/* =========================
   NOAA ALERTS
========================= */

export interface NOAAAlert {
	id: string;
	issue_time: string | null;
	product_id: string | null;
	message: string;
	severity: string;
}

export interface NOAAAlertsResponse {
	count: number;
	alerts: NOAAAlert[];
}

export interface CurrentAlertResponse {
	active: boolean;
	alert: NOAAAlert | null;
}

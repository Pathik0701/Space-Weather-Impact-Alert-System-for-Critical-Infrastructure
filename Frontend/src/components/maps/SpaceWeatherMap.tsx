import { useEffect, useMemo, useRef } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type {
	AuroraMapResponse,
	InfrastructureRisk,
	InfrastructureType,
	RiskLevel,
} from '../../types/spaceWeather';

interface RiskLocation {
	infrastructure: InfrastructureType;
	latitude: number;
	longitude: number;
	label: string;
}

interface Props {
	risks: InfrastructureRisk[];
	locations?: RiskLocation[];
	kp?: number | null;
	loading?: boolean;
	mapData?: AuroraMapResponse | null;
}

const LEVEL_STYLES: Record<
	RiskLevel,
	{
		color: string;
		fillColor: string;
	}
> = {
	NORMAL: {
		color: '#059669',
		fillColor: '#10b981',
	},
	WATCH: {
		color: '#ca8a04',
		fillColor: '#eab308',
	},
	ADVISORY: {
		color: '#ea580c',
		fillColor: '#f97316',
	},
	WARNING: {
		color: '#dc2626',
		fillColor: '#ef4444',
	},
	CRITICAL: {
		color: '#991b1b',
		fillColor: '#dc2626',
	},
};

const INFRASTRUCTURE_LABELS: Record<InfrastructureType, string> = {
	power_grid: 'Power Grid',
	gnss: 'GNSS',
	telecommunications: 'Telecommunications',
	satellites: 'Satellites',
	aviation: 'Aviation',
	railways: 'Railways',
};

<<<<<<< HEAD
/*
 * Representative monitoring/reference locations.
 *
 * IMPORTANT:
 * These are NOT claiming that the infrastructure physically
 * exists only at these points.
 *
 * They are used to give the dashboard a geographic reference
 * for the sector-level risk returned by the backend.
 */
const DEFAULT_LOCATIONS: RiskLocation[] = [
	{
		infrastructure: 'power_grid',
		latitude: 28.6,
		longitude: 77.2,
		label: 'India Power Infrastructure',
	},
	{
		infrastructure: 'gnss',
		latitude: 40.7,
		longitude: -74.0,
		label: 'North America GNSS Reference',
	},
	{
		infrastructure: 'telecommunications',
		latitude: 51.5,
		longitude: -0.1,
		label: 'Europe Telecommunications Reference',
	},
	{
		infrastructure: 'satellites',
		latitude: 35.7,
		longitude: 139.7,
		label: 'Asia-Pacific Satellite Reference',
	},
];

function getRiskRadius(score: number) {
	if (score >= 80) return 22;
	if (score >= 60) return 19;
	if (score >= 35) return 16;
	if (score >= 15) return 14;

	return 12;
}

function getKpRiskLevel(kp: number): RiskLevel {
	if (kp >= 8) return 'CRITICAL';
	if (kp >= 7) return 'WARNING';
	if (kp >= 5) return 'ADVISORY';
	if (kp >= 4) return 'WATCH';

	return 'NORMAL';
}

function SpaceWeatherMap({
	risks,
	locations = DEFAULT_LOCATIONS,
	kp = null,
	loading = false,
=======
function SpaceWeatherMap({
	risks,
	locations = [],
	loading = false,
	mapData = null,
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
}: Props) {
	const mapRef = useRef<HTMLDivElement | null>(null);

	const leafletMapRef = useRef<L.Map | null>(null);

<<<<<<< HEAD
	const markersRef = useRef<L.CircleMarker[]>([]);
	const zonesRef = useRef<L.Circle[]>([]);

	/*
	 * Create map once.
=======
	const infrastructureMarkersRef = useRef<L.CircleMarker[]>([]);

	const heatLayerRef = useRef<L.LayerGroup | null>(null);

	/*
	 * ---------------------------------------------------------
	 * Prepare valid map points
	 * ---------------------------------------------------------
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
	 */

	const validPoints = useMemo(() => {
		const points = mapData?.points ?? [];

		return points.filter((point) => {
			return (
				Number.isFinite(point.latitude) &&
				Number.isFinite(point.longitude) &&
				Number.isFinite(point.value) &&
				point.latitude >= -90 &&
				point.latitude <= 90 &&
				point.longitude >= -180 &&
				point.longitude <= 180
			);
		});
	}, [mapData]);

	/*
	 * ---------------------------------------------------------
	 * Create Leaflet map ONCE
	 * ---------------------------------------------------------
	 */

	useEffect(() => {
		const container = mapRef.current;

		if (!container) {
			return;
		}

<<<<<<< HEAD
		const map = L.map(mapRef.current, {
			center: [25, 20],
=======
		if (leafletMapRef.current) {
			return;
		}

		const map = L.map(container, {
			center: [20, 0],
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
			zoom: 2,
			minZoom: 2,
			maxZoom: 6,
			scrollWheelZoom: false,
			worldCopyJump: true,
			preferCanvas: true,
		});

<<<<<<< HEAD
		L.tileLayer(
			'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{
				attribution: '&copy; OpenStreetMap contributors',
			},
		).addTo(map);

		leafletMapRef.current = map;

		setTimeout(() => {
=======
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors',
			maxZoom: 19,
		}).addTo(map);

		leafletMapRef.current = map;

		const resizeTimer = window.setTimeout(() => {
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
			map.invalidateSize();
		}, 100);

		return () => {
			window.clearTimeout(resizeTimer);

			infrastructureMarkersRef.current.forEach((marker) => {
				marker.remove();
			});

			infrastructureMarkersRef.current = [];

			if (heatLayerRef.current) {
				heatLayerRef.current.removeFrom(map);
				heatLayerRef.current = null;
			}

			map.remove();

			leafletMapRef.current = null;
		};
	}, []);

	/*
<<<<<<< HEAD
	 * Update infrastructure markers.
=======
	 * ---------------------------------------------------------
	 * Render geospatial data
	 * ---------------------------------------------------------
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
	 */

	useEffect(() => {
		const map = leafletMapRef.current;

<<<<<<< HEAD
		if (!map) return;

		markersRef.current.forEach((marker) => marker.remove());
		markersRef.current = [];

		if (!risks.length) return;

		const locationMap = new Map(
			locations.map((location) => [
				location.infrastructure,
				location,
			]),
=======
		if (!map) {
			return;
		}

		/*
		 * Remove previous point layer
		 */
		if (heatLayerRef.current) {
			heatLayerRef.current.removeFrom(map);
			heatLayerRef.current = null;
		}

		if (validPoints.length === 0) {
			return;
		}

		/*
		 * Determine value range
		 *
		 * API values may be nullable, so calculate a safe
		 * fallback from the actual valid points.
		 */

		const calculatedMin = Math.min(...validPoints.map((point) => point.value));

		const calculatedMax = Math.max(...validPoints.map((point) => point.value));

		const minValue = mapData?.min_value ?? calculatedMin;

		const maxValue = mapData?.max_value ?? calculatedMax;

		const range = Math.max(maxValue - minValue, 1);

		/*
		 * Use a shared Canvas renderer.
		 * This is significantly more efficient for thousands
		 * of points than creating individual SVG elements.
		 */

		const renderer = L.canvas({
			padding: 0.5,
		});

		const layerGroup = L.layerGroup();

		validPoints.forEach((point) => {
			const normalized = Math.max(
				0,
				Math.min(1, (point.value - minValue) / range),
			);

			let color: string;

			if (normalized < 0.33) {
				color = '#22c55e';
			} else if (normalized < 0.66) {
				color = '#eab308';
			} else {
				color = '#ef4444';
			}

			L.circleMarker([point.latitude, point.longitude], {
				renderer,
				radius: 2,
				stroke: false,
				fillColor: color,
				fillOpacity: 0.65,
			}).addTo(layerGroup);
		});

		layerGroup.addTo(map);

		heatLayerRef.current = layerGroup;

		return () => {
			layerGroup.removeFrom(map);

			if (heatLayerRef.current === layerGroup) {
				heatLayerRef.current = null;
			}
		};
	}, [validPoints, mapData]);

	/*
	 * ---------------------------------------------------------
	 * Infrastructure risk markers
	 * ---------------------------------------------------------
	 */

	useEffect(() => {
		const map = leafletMapRef.current;

		if (!map) {
			return;
		}

		/*
		 * Remove previous infrastructure markers
		 */

		infrastructureMarkersRef.current.forEach((marker) => {
			marker.remove();
		});

		infrastructureMarkersRef.current = [];

		if (risks.length === 0 || locations.length === 0) {
			return;
		}

		const locationMap = new Map<InfrastructureType, RiskLocation>(
			locations.map((location) => [location.infrastructure, location]),
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
		);

		risks.forEach((risk) => {
			const location = locationMap.get(risk.infrastructure);

<<<<<<< HEAD
			if (!location) return;

			const style = LEVEL_STYLES[risk.level];

			const score = Math.min(
				Math.max(Number(risk.score) || 0, 0),
				100,
			);

			const radius = getRiskRadius(score);

			/*
			 * Outer pulse/reference circle
			 */
			const outer = L.circleMarker(
				[location.latitude, location.longitude],
				{
					radius: radius + 7,
					color: style.color,
					fillColor: style.fillColor,
					fillOpacity: 0.08,
					weight: 1,
					opacity: 0.4,
				},
			).addTo(map);

			/*
			 * Main risk indicator.
			 */
			const marker = L.circleMarker(
				[location.latitude, location.longitude],
				{
					radius,
					color: '#ffffff',
					fillColor: style.fillColor,
					fillOpacity: 0.9,
					weight: 3,
				},
			).addTo(map);

			/*
			 * Tooltip shown on hover.
			 */
			marker.bindTooltip(
				`
					<div style="font-family: Inter, sans-serif;">
						<strong style="font-size:13px;">
							${INFRASTRUCTURE_LABELS[risk.infrastructure]}
						</strong>

						<div style="
							margin-top:5px;
							font-size:11px;
							color:#64748b;
						">
							${location.label}
						</div>

						<div style="
							margin-top:8px;
							font-size:12px;
						">
							<strong style="color:${style.color};">
								${risk.level}
							</strong>
							&nbsp; · &nbsp;
							${Math.round(score)}/100
						</div>
					</div>
				`,
				{
					direction: 'top',
					offset: [0, -10],
					opacity: 0.97,
				},
			);

			/*
			 * Detailed popup.
			 */
			marker.bindPopup(`
				<div style="
					min-width:220px;
					font-family:Inter,Arial,sans-serif;
				">
					<div style="
						font-size:15px;
						font-weight:800;
						color:#0f172a;
					">
						${INFRASTRUCTURE_LABELS[risk.infrastructure]}
					</div>

					<div style="
						margin-top:4px;
						font-size:11px;
						color:#64748b;
					">
						${location.label}
					</div>

					<div style="
						margin-top:14px;
						padding:10px;
						border-radius:10px;
						background:${style.fillColor}15;
					">
						<div style="
							display:flex;
							justify-content:space-between;
						">
							<span>Risk Level</span>
							<strong style="color:${style.color};">
								${risk.level}
							</strong>
						</div>

						<div style="
							display:flex;
							justify-content:space-between;
							margin-top:6px;
						">
							<span>Risk Score</span>
							<strong>
								${Math.round(score)}/100
							</strong>
						</div>

						<div style="
							display:flex;
							justify-content:space-between;
							margin-top:6px;
						">
							<span>Confidence</span>
							<strong>
								${Math.round(Number(risk.confidence) || 0)}%
							</strong>
						</div>
					</div>
				</div>
			`);

			/*
			 * Keep both circles so they can be removed next update.
			 */
			markersRef.current.push(marker);
			markersRef.current.push(outer);
=======
			if (!location) {
				return;
			}

			const style = LEVEL_STYLES[risk.level];

			/*
			 * Defensive check in case an unexpected API risk level
			 * reaches the frontend.
			 */

			if (!style) {
				return;
			}

			const marker = L.circleMarker([location.latitude, location.longitude], {
				radius: 10,
				color: style.color,
				fillColor: style.fillColor,
				fillOpacity: 0.85,
				weight: 3,
				renderer: L.canvas(),
			}).addTo(map);

			const infrastructureLabel = INFRASTRUCTURE_LABELS[risk.infrastructure];

			marker.bindPopup(`
        <div style="min-width:190px;">
          <p
            style="
              margin:0;
              font-size:14px;
              font-weight:800;
              color:#0f172a;
            "
          >
            ${infrastructureLabel}
          </p>

          <div
            style="
              margin-top:10px;
              font-size:13px;
            "
          >
            <div
              style="
                display:flex;
                justify-content:space-between;
                margin-bottom:5px;
              "
            >
              <span style="color:#64748b;">
                Risk
              </span>

              <strong>
                ${risk.level}
              </strong>
            </div>

            <div
              style="
                display:flex;
                justify-content:space-between;
                margin-bottom:5px;
              "
            >
              <span style="color:#64748b;">
                Score
              </span>

              <strong>
                ${risk.score.toFixed(1)}
              </strong>
            </div>

            <div
              style="
                display:flex;
                justify-content:space-between;
              "
            >
              <span style="color:#64748b;">
                Confidence
              </span>

              <strong>
                ${Math.round(risk.confidence * 100)}%
              </strong>
            </div>
          </div>
        </div>
      `);

			infrastructureMarkersRef.current.push(marker);
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
		});

		return () => {
			infrastructureMarkersRef.current.forEach((marker) => {
				marker.remove();
			});

			infrastructureMarkersRef.current = [];
		};
	}, [risks, locations]);

	/*
<<<<<<< HEAD
	 * Dynamic geomagnetic zones based on Kp.
	 */
	useEffect(() => {
		const map = leafletMapRef.current;

		if (!map) return;

		zonesRef.current.forEach((zone) => zone.remove());
		zonesRef.current = [];

		if (kp === null || kp === undefined) return;

		const level = getKpRiskLevel(kp);
		const style = LEVEL_STYLES[level];

		/*
		 * Higher Kp means stronger geomagnetic disturbance.
		 *
		 * The visual zone is deliberately broad and illustrative.
		 * It should NOT be interpreted as a precise forecast boundary.
		 */
		const zoneRadius =
			kp >= 8
				? 1800000
				: kp >= 7
					? 1600000
					: kp >= 5
						? 1300000
						: kp >= 4
							? 1000000
							: 700000;

		/*
		 * Northern geomagnetic zone.
		 */
		const northZone = L.circle(
			[65, 0],
			{
				radius: zoneRadius,
				color: style.color,
				fillColor: style.fillColor,
				fillOpacity: 0.05,
				weight: 1,
				opacity: 0.35,
				interactive: false,
			},
		).addTo(map);

		/*
		 * Southern geomagnetic zone.
		 */
		const southZone = L.circle(
			[-65, 0],
			{
				radius: zoneRadius,
				color: style.color,
				fillColor: style.fillColor,
				fillOpacity: 0.05,
				weight: 1,
				opacity: 0.35,
				interactive: false,
			},
		).addTo(map);

		zonesRef.current.push(northZone, southZone);
	}, [kp]);
=======
	 * ---------------------------------------------------------
	 * Loading state
	 * ---------------------------------------------------------
	 */
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)

	if (loading) {
		return (
			<div className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
		);
	}

<<<<<<< HEAD
	const currentKpLevel =
		kp !== null && kp !== undefined
			? getKpRiskLevel(kp)
			: null;

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			{/* Header */}
			<div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
						Geospatial Monitoring
					</p>

					<h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
						Space Weather Impact
					</h2>

					<p className="mt-1 text-xs text-slate-400">
						Live infrastructure risk and geomagnetic activity.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{(Object.keys(LEVEL_STYLES) as RiskLevel[]).map(
						(level) => (
							<div
								key={level}
								className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500"
							>
								<span
									className="h-2.5 w-2.5 rounded-full"
									style={{
										backgroundColor:
											LEVEL_STYLES[level].fillColor,
									}}
								/>

								{level}
							</div>
						),
					)}
				</div>
			</div>

			{/* Map */}
			<div className="relative h-[380px]">
				<div
					ref={mapRef}
					className="h-full w-full"
				/>

				{/* Kp status */}
				{kp !== null && kp !== undefined && (
					<div className="absolute left-4 top-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-md backdrop-blur">
						<p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
							Geomagnetic Activity
						</p>

						<div className="mt-1 flex items-baseline gap-2">
							<span className="text-xl font-black text-slate-900">
								Kp {kp.toFixed(1)}
							</span>

							<span
								className="text-[10px] font-black uppercase"
								style={{
									color:
										currentKpLevel
											? LEVEL_STYLES[currentKpLevel]
													.color
											: '#64748b',
								}}
							>
								{currentKpLevel}
							</span>
						</div>
=======
	/*
	 * ---------------------------------------------------------
	 * Render UI
	 * ---------------------------------------------------------
	 */

	return (
		<>
			<div className="mb-5">
				<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
					Geospatial Monitoring
				</p>

				<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
					Space Weather Impact Map
				</h2>

				<p className="mt-1 max-w-2xl text-sm text-slate-500">
					Geographic view of current infrastructure risk and space-weather
					impact.
				</p>
			</div>

			<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				{/* Map header */}

				<div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs font-bold tracking-widest text-slate-400">
							GLOBAL RISK MAP
						</p>

						<h2 className="mt-1 text-xl font-black text-slate-900">
							Space Weather Impact
						</h2>
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
					</div>

<<<<<<< HEAD
				{/* Map explanation */}
				<div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
					<p className="text-[11px] font-bold text-slate-700">
						Live infrastructure exposure
					</p>

					<p className="mt-0.5 max-w-[230px] text-[9px] leading-4 text-slate-400">
						Marker colors represent sector risk from the
						NOAA-derived risk engine.
					</p>
=======
					<div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
						{(Object.keys(LEVEL_STYLES) as RiskLevel[]).map((level) => (
							<div
								key={level}
								className="flex items-center gap-1.5"
							>
								<span
									className="h-2.5 w-2.5 rounded-full"
									style={{
										backgroundColor: LEVEL_STYLES[level].fillColor,
									}}
								/>

								<span>{level}</span>
							</div>
						))}
					</div>
				</div>

				{/* Map */}

				<div className="relative h-[420px]">
					<div
						ref={mapRef}
						className="h-full w-full"
					/>

					{/* No data */}

					{!validPoints.length && !locations.length && (
						<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
							<div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-center shadow-sm backdrop-blur">
								<p className="text-sm font-bold text-slate-700">
									No regional data available
								</p>

								<p className="mt-1 text-xs text-slate-400">
									Map data will appear when available.
								</p>
							</div>
						</div>
					)}

					{/* Map data information */}

					{mapData && (
						<div className="pointer-events-none absolute right-4 top-4 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
							<p className="font-bold text-slate-700">Regional Forecast</p>

							<p className="mt-1 text-slate-400">
								Points: {validPoints.length.toLocaleString()}
							</p>

							<p className="text-slate-400">
								Range: {mapData.min_value ?? '—'} – {mapData.max_value ?? '—'}
							</p>

							{mapData.observation_time && (
								<p className="text-slate-400">
									Observed:{' '}
									{new Date(mapData.observation_time).toLocaleString()}
								</p>
							)}

							{mapData.forecast_time && (
								<p className="text-slate-400">
									Forecast: {new Date(mapData.forecast_time).toLocaleString()}
								</p>
							)}
						</div>
					)}

					{/* Infrastructure information */}

					<div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
						<p className="font-bold text-slate-700">
							Live infrastructure exposure
						</p>

						<p className="mt-0.5 text-slate-400">
							NOAA-derived space weather risk
						</p>
					</div>
>>>>>>> 39cafe3 (feat: integrate AI assistant for space weather queries and add aurora map functionality)
				</div>

				{/* Disclaimer */}
				<div className="pointer-events-none absolute bottom-4 right-4 z-[1000] hidden max-w-[280px] rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-[9px] leading-4 text-slate-400 shadow-sm backdrop-blur sm:block">
					Geomagnetic zones are indicative visualization
					regions, not precise impact boundaries.
				</div>
			</div>
		</>
	);
}

export default SpaceWeatherMap;
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
}

interface Props {
	risks: InfrastructureRisk[];
	locations?: RiskLocation[];
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

function SpaceWeatherMap({
	risks,
	locations = [],
	loading = false,
	mapData = null,
}: Props) {
	const mapRef = useRef<HTMLDivElement | null>(null);

	const leafletMapRef = useRef<L.Map | null>(null);

	const infrastructureMarkersRef = useRef<L.CircleMarker[]>([]);

	const heatLayerRef = useRef<L.LayerGroup | null>(null);

	/*
	 * ---------------------------------------------------------
	 * Prepare valid map points
	 * ---------------------------------------------------------
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

		if (leafletMapRef.current) {
			return;
		}

		const map = L.map(container, {
			center: [20, 0],
			zoom: 2,
			minZoom: 2,
			maxZoom: 6,
			scrollWheelZoom: false,
			worldCopyJump: true,
			preferCanvas: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors',
			maxZoom: 19,
		}).addTo(map);

		leafletMapRef.current = map;

		const resizeTimer = window.setTimeout(() => {
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
	 * ---------------------------------------------------------
	 * Render geospatial data
	 * ---------------------------------------------------------
	 */

	useEffect(() => {
		const map = leafletMapRef.current;

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
		);

		risks.forEach((risk) => {
			const location = locationMap.get(risk.infrastructure);

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
		});

		return () => {
			infrastructureMarkersRef.current.forEach((marker) => {
				marker.remove();
			});

			infrastructureMarkersRef.current = [];
		};
	}, [risks, locations]);

	/*
	 * ---------------------------------------------------------
	 * Loading state
	 * ---------------------------------------------------------
	 */

	if (loading) {
		return (
			<div className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
		);
	}

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
					</div>

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
				</div>
			</div>
		</>
	);
}

export default SpaceWeatherMap;

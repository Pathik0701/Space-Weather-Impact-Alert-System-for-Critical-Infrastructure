import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type {
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

function SpaceWeatherMap({ risks, locations = [], loading = false }: Props) {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const leafletMapRef = useRef<L.Map | null>(null);
	const markersRef = useRef<L.CircleMarker[]>([]);

	/*
	 * Create the Leaflet map once.
	 */
	useEffect(() => {
		if (!mapRef.current || leafletMapRef.current) {
			return;
		}

		const map = L.map(mapRef.current, {
			center: [20, 0],
			zoom: 2,
			minZoom: 2,
			maxZoom: 6,
			scrollWheelZoom: false,
			worldCopyJump: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors',
		}).addTo(map);

		leafletMapRef.current = map;

		return () => {
			map.remove();
			leafletMapRef.current = null;
		};
	}, []);

	/*
	 * Update markers whenever risk/location data changes.
	 */
	useEffect(() => {
		const map = leafletMapRef.current;

		if (!map) {
			return;
		}

		// Remove previous markers.
		markersRef.current.forEach((marker) => {
			marker.remove();
		});

		markersRef.current = [];

		if (!risks.length || !locations.length) {
			return;
		}

		const locationMap = new Map(
			locations.map((location) => [location.infrastructure, location]),
		);

		risks.forEach((risk) => {
			const location = locationMap.get(risk.infrastructure);

			// No coordinates = don't render a fake location.
			if (!location) {
				return;
			}

			const style = LEVEL_STYLES[risk.level];

			const marker = L.circleMarker([location.latitude, location.longitude], {
				radius: 12,
				color: style.color,
				fillColor: style.fillColor,
				fillOpacity: 0.75,
				weight: 3,
			}).addTo(map);

			marker.bindPopup(`
				<div style="min-width: 190px;">
					<p style="
						margin: 0;
						font-size: 14px;
						font-weight: 800;
						color: #0f172a;
					">
						${INFRASTRUCTURE_LABELS[risk.infrastructure]}
					</p>

					<div style="
						margin-top: 10px;
						font-size: 13px;
					">
						<div style="
							display: flex;
							justify-content: space-between;
							gap: 20px;
							margin-bottom: 5px;
						">
							<span style="color: #64748b;">Risk</span>
							<strong>${risk.level}</strong>
						</div>

						<div style="
							display: flex;
							justify-content: space-between;
							gap: 20px;
							margin-bottom: 5px;
						">
							<span style="color: #64748b;">Score</span>
							<strong>${risk.score.toFixed(1)}</strong>
						</div>

						<div style="
							display: flex;
							justify-content: space-between;
							gap: 20px;
						">
							<span style="color: #64748b;">Confidence</span>
							<strong>${Math.round(risk.confidence * 100)}%</strong>
						</div>
					</div>
				</div>
			`);

			markersRef.current.push(marker);
		});
	}, [risks, locations]);

	if (loading) {
		return (
			<div className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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

			<div className="relative h-[420px]">
				<div
					ref={mapRef}
					className="h-full w-full"
				/>

				{!locations.length && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-center shadow-sm backdrop-blur">
							<p className="text-sm font-bold text-slate-700">
								No regional location data available
							</p>

							<p className="mt-1 text-xs text-slate-400">
								Location data will appear when available.
							</p>
						</div>
					</div>
				)}

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
	);
}

export default SpaceWeatherMap;

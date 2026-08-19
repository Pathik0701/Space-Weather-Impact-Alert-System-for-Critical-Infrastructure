import type { SolarWindData } from '../../types/spaceWeather';

import LoadingSkeleton from '../ui/LoadingSkeleton';

interface Props {
	data: SolarWindData | null;
	loading: boolean;
}

function SolarWindCard({ data, loading }: Props) {
	const metrics = [
		['Speed', data?.speed, 'km/s'],

		['Density', data?.density, 'cm⁻³'],

		['Bz', data?.bz, 'nT'],

		['Bt', data?.bt, 'nT'],
	];

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<p className="text-xs font-bold tracking-widest text-slate-400">
				SOLAR WIND
			</p>

			<h3 className="mt-2 text-lg font-black text-slate-900">
				Real-time plasma
			</h3>

			{loading || !data ? (
				<div className="mt-6 grid grid-cols-2 gap-4">
					{Array.from({
						length: 4,
					}).map((_, index) => (
						<LoadingSkeleton
							key={index}
							className="h-12"
						/>
					))}
				</div>
			) : (
				<div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
					{metrics.map(([label, value, unit]) => (
						<div key={label}>
							<p className="text-xs text-slate-400">{label}</p>

							<p className="mt-1 text-xl font-black text-slate-900">
								{typeof value === 'number' ? value.toFixed(1) : '--'}

								<span className="ml-1 text-xs font-normal text-slate-400">
									{unit}
								</span>
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default SolarWindCard;

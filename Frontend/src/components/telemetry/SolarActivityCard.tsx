import type { SolarActivityData } from '../../types/spaceWeather';

import LoadingSkeleton from '../ui/LoadingSkeleton';

interface Props {
	data: SolarActivityData | null;
	loading: boolean;
}

function SolarActivityCard({ data, loading }: Props) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<p className="text-xs font-bold tracking-widest text-slate-400">
				SOLAR ACTIVITY
			</p>

			<h3 className="mt-2 text-lg font-black text-slate-900">X-ray & Proton</h3>

			{loading || !data ? (
				<div className="mt-6 space-y-3">
					<LoadingSkeleton className="h-10 w-full" />
					<LoadingSkeleton className="h-10 w-full" />
					<LoadingSkeleton className="h-10 w-full" />
				</div>
			) : (
				<div className="mt-6 space-y-4">
					<div className="flex justify-between">
						<span className="text-sm text-slate-400">Flare</span>

						<span className="font-black">
							{data.flare_class ?? 'No active flare'}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-sm text-slate-400">X-ray flux</span>

						<span className="font-black">
							{data.xray_flux ? data.xray_flux.toExponential(2) : '--'}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-sm text-slate-400">Proton flux</span>

						<span className="font-black">
							{data.proton_flux ? data.proton_flux.toFixed(2) : '--'}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export default SolarActivityCard;

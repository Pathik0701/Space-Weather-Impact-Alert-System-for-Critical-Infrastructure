import type { GeomagneticData } from '../../types/spaceWeather';

import LoadingSkeleton from '../ui/LoadingSkeleton';

interface Props {
	data: GeomagneticData | null;
	loading: boolean;
}

function GeomagneticCard({ data, loading }: Props) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<p className="text-xs font-bold tracking-widest text-slate-400">
				GEOMAGNETIC
			</p>

			<h3 className="mt-2 text-lg font-black text-slate-900">Kp & Dst</h3>

			{loading || !data ? (
				<div className="mt-6 space-y-3">
					<LoadingSkeleton className="h-10 w-24" />
					<LoadingSkeleton className="h-10 w-24" />
				</div>
			) : (
				<div className="mt-6 grid grid-cols-2 gap-4">
					<div>
						<p className="text-xs text-slate-400">Kp Index</p>

						<p className="mt-1 text-3xl font-black">
							{data.kp?.toFixed(1) ?? '--'}
						</p>
					</div>

					<div>
						<p className="text-xs text-slate-400">Dst</p>

						<p className="mt-1 text-3xl font-black">
							{data.dst?.toFixed(0) ?? '--'}
							<span className="ml-1 text-sm font-normal text-slate-400">
								nT
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default GeomagneticCard;

import type { SpaceWeatherRisk } from '../../types/spaceWeather';

import RiskBadge from '../ui/RiskBadge';
import LoadingSkeleton from '../ui/LoadingSkeleton';

interface Props {
	risk: SpaceWeatherRisk | null;
	loading: boolean;
}

function OverallRiskCard({ risk, loading }: Props) {
	return (
		<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-xs font-bold tracking-widest text-slate-400">
						OVERALL SPACE WEATHER RISK
					</p>

					<h2 className="mt-2 text-2xl font-black text-slate-900">
						System Risk
					</h2>
				</div>

				{risk && <RiskBadge level={risk.overall_level} />}
			</div>

			{loading || !risk ? (
				<div className="mt-8">
					<LoadingSkeleton className="h-16 w-32" />
				</div>
			) : (
				<>
					<div className="mt-8 flex items-end gap-3">
						<span className="text-6xl font-black tracking-tight text-slate-900">
							{Math.round(risk.overall_score)}
						</span>

						<span className="mb-2 text-xl text-slate-400">/100</span>
					</div>

					<div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full rounded-full bg-slate-900 transition-all duration-700"
							style={{
								width: `${risk.overall_score}%`,
							}}
						/>
					</div>

					<p className="mt-4 text-sm text-slate-500">
						Confidence:{' '}
						<span className="font-bold text-slate-700">
							{Math.round(risk.confidence)}%
						</span>
					</p>
				</>
			)}
		</section>
	);
}

export default OverallRiskCard;

import type { InfrastructureRisk } from '../../types/spaceWeather';

import RiskBadge from '../ui/RiskBadge';
import LoadingSkeleton from '../ui/LoadingSkeleton';

interface Props {
	risk?: InfrastructureRisk;
	loading: boolean;
}

const metadata = {
	power_grid: {
		title: 'Power Grid',
		icon: '⚡',
		description: 'Geomagnetically induced currents',
	},

	gnss: {
		title: 'GNSS',
		icon: '📡',
		description: 'Navigation and positioning',
	},

	telecommunications: {
		title: 'Telecommunications',
		icon: '📶',
		description: 'Radio and communication systems',
	},

	satellites: {
		title: 'Satellites',
		icon: '🛰️',
		description: 'Orbital and radiation exposure',
	},
};

function InfrastructureRiskCard({ risk, loading }: Props) {
	if (loading || !risk) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-5">
				<LoadingSkeleton className="h-5 w-32" />
				<LoadingSkeleton className="mt-5 h-10 w-24" />
				<LoadingSkeleton className="mt-4 h-2 w-full" />
			</div>
		);
	}

	const info = metadata[risk.infrastructure];

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<span className="text-2xl">{info.icon}</span>

					<div>
						<h3 className="font-black text-slate-900">{info.title}</h3>

						<p className="mt-1 text-xs text-slate-400">{info.description}</p>
					</div>
				</div>

				<RiskBadge level={risk.level} />
			</div>

			<div className="mt-7 flex items-end gap-2">
				<span className="text-4xl font-black text-slate-900">
					{Math.round(risk.score)}
				</span>

				<span className="mb-1 text-sm text-slate-400">/100</span>
			</div>

			<div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
				<div
					className="h-full rounded-full bg-slate-900 transition-all duration-700"
					style={{
						width: `${risk.score}%`,
					}}
				/>
			</div>

			<div className="mt-4 flex justify-between text-xs">
				<span className="text-slate-400">Confidence</span>

				<span className="font-bold text-slate-700">
					{Math.round(risk.confidence)}%
				</span>
			</div>
		</div>
	);
}

export default InfrastructureRiskCard;

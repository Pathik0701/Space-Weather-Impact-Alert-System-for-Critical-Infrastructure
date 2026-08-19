import type { InfrastructureRisk } from '../../types/spaceWeather';

import InfrastructureRiskCard from './InfrastructureRiskCard';

interface Props {
	risks: InfrastructureRisk[];
	loading: boolean;
}

function InfrastructureRiskGrid({ risks, loading }: Props) {
	return (
		<section>
			<div className="mb-4">
				<p className="text-xs font-bold tracking-widest text-slate-400">
					CRITICAL INFRASTRUCTURE
				</p>

				<h2 className="mt-1 text-2xl font-black text-slate-900">
					Impact Assessment
				</h2>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{['power_grid', 'gnss', 'telecommunications', 'satellites'].map(
					(type) => {
						const risk = risks.find((item) => item.infrastructure === type);
						console.log(risk);

						return (
							<InfrastructureRiskCard
								key={type}
								risk={risk}
								loading={loading}
							/>
						);
					},
				)}
			</div>
		</section>
	);
}

export default InfrastructureRiskGrid;

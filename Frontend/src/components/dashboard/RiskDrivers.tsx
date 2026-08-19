import type { RiskFactor } from '../../types/spaceWeather';

interface Props {
	factors: RiskFactor[];
}

function RiskDrivers({ factors }: Props) {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<div className="mb-5">
				<p className="text-xs font-bold tracking-widest text-slate-400">
					RISK ENGINE
				</p>

				<h2 className="mt-1 text-xl font-black">Primary Drivers</h2>
			</div>

			<div className="space-y-4">
				{factors.map((factor) => (
					<div key={factor.name}>
						<div className="mb-2 flex justify-between">
							<span className="text-sm font-semibold capitalize text-slate-700">
								{factor.name}
							</span>

							<span className="text-sm font-bold">
								{Math.round(factor.normalized_score)}
							</span>
						</div>

						<div className="h-2 overflow-hidden rounded-full bg-slate-100">
							<div
								className="h-full rounded-full bg-slate-800 transition-all duration-700"
								style={{
									width: `${factor.normalized_score}%`,
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default RiskDrivers;

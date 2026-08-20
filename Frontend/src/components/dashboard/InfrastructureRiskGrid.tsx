import type { InfrastructureRisk } from '../../types/spaceWeather';
import InfrastructureRiskCard from './InfrastructureRiskCard';

interface Props {
	risks: InfrastructureRisk[];
	loading: boolean;
}

function InfrastructureRiskGrid({ risks, loading }: Props) {
	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			{risks.map((risk) => (
				<InfrastructureRiskCard
					key={risk.infrastructure}
					risk={risk}
					loading={loading}
				/>
			))}
		</div>
	);
}

export default InfrastructureRiskGrid;

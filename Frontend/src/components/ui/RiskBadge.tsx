import type { RiskLevel } from '../../types/spaceWeather';
import { getRiskClasses } from '../../utils/risk';

interface RiskBadgeProps {
	level: RiskLevel;
}

function RiskBadge({ level }: RiskBadgeProps) {
	const styles = getRiskClasses(level);

	return (
		<span
			className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${styles.badge}`}
		>
			{level}
		</span>
	);
}

export default RiskBadge;

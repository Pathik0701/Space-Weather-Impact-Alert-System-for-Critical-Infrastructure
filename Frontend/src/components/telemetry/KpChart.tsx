import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from 'recharts';

import type { KpHistory } from '../../types/spaceWeather';

interface Props {
	data: KpHistory[];
}

function KpChart({ data }: Props) {
	const chartData = data
		.filter(
			(item): item is KpHistory & { kp: number; time_tag: string } =>
				item.kp !== null && item.time_tag !== null,
		)
		.map((item) => ({
			time: new Date(item.time_tag).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			kp: item.kp,
		}));

	return (
		<div className="h-80 w-full">
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<LineChart data={chartData}>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="#e2e8f0"
					/>

					<XAxis
						dataKey="time"
						tick={{ fontSize: 11 }}
					/>

					<YAxis
						domain={[0, 9]}
						tick={{ fontSize: 11 }}
					/>

					<Tooltip />

					<Line
						type="monotone"
						dataKey="kp"
						stroke="#0f172a"
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default KpChart;

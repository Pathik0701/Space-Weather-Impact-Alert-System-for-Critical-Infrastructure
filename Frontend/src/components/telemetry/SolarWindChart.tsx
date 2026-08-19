import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from 'recharts';

import type { SolarWindHistory } from '../../types/spaceWeather';

interface Props {
	data: SolarWindHistory[];
}

function SolarWindChart({ data }: Props) {
	const chartData = data.map((item) => ({
		time: new Date(item.time_tag!).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		}),

		speed: item.speed,
		density: item.density,
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

					<YAxis />

					<Tooltip />

					<Line
						type="monotone"
						dataKey="speed"
						stroke="#0f172a"
						strokeWidth={2}
						dot={false}
						name="Speed km/s"
					/>

					<Line
						type="monotone"
						dataKey="density"
						stroke="#64748b"
						strokeWidth={2}
						dot={false}
						name="Density"
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default SolarWindChart;

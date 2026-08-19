import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

interface XrayPoint {
	time_tag: string | null;
	value: number | null;
}

interface Props {
	data: XrayPoint[];
}

function XrayChart({ data }: Props) {
	const chartData = data
		.filter((item) => item.value !== null)
		.map((item) => ({
			time: item.time_tag
				? new Date(item.time_tag).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})
				: '',
			value: item.value,
		}));

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="mb-4">
				<h3 className="font-bold text-slate-900">X-Ray Flux</h3>
				<p className="text-sm text-slate-500">Solar X-ray activity over time</p>
			</div>

			<div className="h-64">
				{chartData.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-slate-400">
						No X-ray data available
					</div>
				) : (
					<ResponsiveContainer
						width="100%"
						height="100%"
					>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />

							<XAxis dataKey="time" />

							<YAxis
								scale="log"
								domain={['auto', 'auto']}
								allowDataOverflow
							/>

							<Tooltip />

							<Line
								type="monotone"
								dataKey="value"
								strokeWidth={2}
								dot={false}
								name="X-Ray Flux"
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}

export default XrayChart;

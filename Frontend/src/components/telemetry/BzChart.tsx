import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ReferenceLine,
	ResponsiveContainer,
} from 'recharts';

interface BzPoint {
	time_tag: string | null;
	bz: number | null;
}

interface Props {
	data: BzPoint[];
}

function BzChart({ data }: Props) {
	const chartData = data
		.filter((item) => item.bz !== null)
		.map((item) => ({
			time: item.time_tag
				? new Date(item.time_tag).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})
				: '',
			bz: item.bz,
		}));

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="mb-4">
				<h3 className="font-bold text-slate-900">Interplanetary Bz</h3>

				<p className="text-sm text-slate-500">
					Southward magnetic field component
				</p>
			</div>

			<div className="h-64">
				{chartData.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-slate-400">
						No Bz data available
					</div>
				) : (
					<ResponsiveContainer
						width="100%"
						height="100%"
					>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />

							<XAxis dataKey="time" />

							<YAxis />

							<Tooltip />

							<ReferenceLine
								y={0}
								strokeDasharray="5 5"
							/>

							<Line
								type="monotone"
								dataKey="bz"
								strokeWidth={2}
								dot={false}
								name="Bz (nT)"
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}

export default BzChart;

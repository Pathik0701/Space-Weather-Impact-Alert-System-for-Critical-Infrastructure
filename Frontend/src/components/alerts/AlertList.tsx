import { useState } from 'react';
import type { NOAAAlert } from '../../types/spaceWeather';

interface Props {
	alerts: NOAAAlert[];
}

function AlertList({ alerts }: Props) {
	const [expanded, setExpanded] = useState(false);

	const visibleAlerts = expanded ? alerts : alerts.slice(0, 1);

	return (
		alerts.length !== 0 && (
			<div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50">
				{/* Header */}
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<span className="text-xl">⚠</span>

						<div>
							<p className="font-bold text-orange-800">
								NOAA Space Weather Alerts
							</p>

							<p className="text-sm text-orange-600">
								{alerts.length} active alert
								{alerts.length !== 1 ? 's' : ''}
							</p>
						</div>
					</div>

					{alerts.length > 1 && (
						<button
							type="button"
							onClick={() => setExpanded((prev) => !prev)}
							className="rounded-lg border border-orange-300 px-3 py-1.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
						>
							{expanded ? 'Show less' : `View all (${alerts.length})`}
						</button>
					)}
				</div>

				{/* Alerts */}
				<div className="space-y-3 px-4 pb-4">
					{visibleAlerts.map((alert) => (
						<div
							key={alert.id}
							className="rounded-xl border border-orange-200 bg-white/70 p-4"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="font-bold uppercase text-orange-800">
										NOAA {alert.severity}
									</p>

									{alert.product_id && (
										<p className="mt-1 text-xs font-medium text-orange-600">
											{alert.product_id}
										</p>
									)}
								</div>

								{alert.issue_time && (
									<time
										dateTime={alert.issue_time}
										className="whitespace-nowrap text-xs text-gray-500"
									>
										{new Date(alert.issue_time).toLocaleString()}
									</time>
								)}
							</div>

							<p className="mt-3 text-sm leading-6 text-orange-900">
								{alert.message}
							</p>
						</div>
					))}
				</div>

				{/* Bottom expand control */}
				{alerts.length > 1 && (
					<button
						type="button"
						onClick={() => setExpanded((prev) => !prev)}
						className="w-full border-t border-orange-200 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
					>
						{expanded
							? 'Collapse alerts ↑'
							: `Show all ${alerts.length} alerts ↓`}
					</button>
				)}
			</div>
		)
	);
}

export default AlertList;

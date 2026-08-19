import type { NOAAAlert } from '../../types/spaceWeather';

interface Props {
	alert: NOAAAlert | null;
}

function AlertBanner({ alert }: Props) {
	if (!alert) {
		return (
			<div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
				<div className="flex items-center gap-3">
					<span className="text-xl">✓</span>

					<div>
						<p className="font-bold text-emerald-800">No active NOAA alert</p>

						<p className="text-sm text-emerald-600">
							No significant active space-weather alert detected.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
			<div className="flex gap-3">
				<span className="text-xl">⚠</span>

				<div>
					<p className="font-bold text-orange-800">NOAA {alert.severity}</p>

					<p className="mt-1 text-sm text-orange-700">{alert.message}</p>
				</div>
			</div>
		</div>
	);
}

export default AlertBanner;

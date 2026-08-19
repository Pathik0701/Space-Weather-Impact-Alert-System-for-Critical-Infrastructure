import type { TimezoneOption } from '../../hooks/useTimezone';

import { formatTime } from '../../utils/formatTime';

interface Props {
	lastUpdated?: string;
	onRefresh: () => void;
	refreshing: boolean;

	timezone: TimezoneOption;
	setTimezone: (value: TimezoneOption) => void;
}

function DashboardHeader({
	lastUpdated,
	onRefresh,
	refreshing,
	timezone,
	setTimezone,
}: Props) {
	return (
		<header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
			<div>
				<p className="mb-2 text-xs font-bold tracking-[0.15em] text-slate-500">
					NOAA SPACE WEATHER MONITORING
				</p>

				<h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
					Space Weather Impact
					<br />
					Alert System
				</h1>

				<p className="mt-4 max-w-xl text-slate-500">
					Real-time monitoring and infrastructure risk assessment.
				</p>
			</div>

			<div className="flex flex-wrap items-center justify-end gap-3">
				<div>
					<label
						htmlFor="timezone"
						className="mb-1 block text-xs font-bold text-slate-400"
					>
						TIMEZONE
					</label>

					<select
						id="timezone"
						value={timezone}
						onChange={(event) =>
							setTimezone(event.target.value as TimezoneOption)
						}
						className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
					>
						<option value="UTC">UTC</option>

						<option value="Asia/Kolkata">IST — India</option>

						<option value="America/New_York">EST/EDT — New York</option>

						<option value="Europe/London">UK — London</option>

						<option value="Asia/Tokyo">JST — Tokyo</option>
					</select>
				</div>

				<div className="text-right">
					<p className="text-xs text-slate-400">Last updated</p>

					<p className="mt-1 text-sm font-bold text-slate-800">
						{formatTime(lastUpdated, timezone)}
					</p>
				</div>

				<button
					onClick={onRefresh}
					disabled={refreshing}
					className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{refreshing ? 'Refreshing...' : '↻ Refresh'}
				</button>
			</div>
		</header>
	);
}

export default DashboardHeader;

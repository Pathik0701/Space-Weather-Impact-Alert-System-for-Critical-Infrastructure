import { useEffect } from 'react';
import { toast } from '../components/ui/toast';

import AlertBanner from '../components/alerts/AlertBanner';
import AlertList from '../components/alerts/AlertList';

import InfrastructureRiskGrid from '../components/dashboard/InfrastructureRiskGrid';
import OverallRiskCard from '../components/dashboard/OverallRiskCard';
import RiskDrivers from '../components/dashboard/RiskDrivers';

import DashboardHeader from '../components/layout/DashboardHeader';
import DashboardLayout from '../components/layout/DashboardLayout';

import GeomagneticCard from '../components/telemetry/GeomagneticCard';
import KpChart from '../components/telemetry/KpChart';
import SolarActivityCard from '../components/telemetry/SolarActivityCard';
import SolarWindCard from '../components/telemetry/SolarWindCard';
import SolarWindChart from '../components/telemetry/SolarWindChart';
import XrayChart from '../components/telemetry/XrayChart';
import BzChart from '../components/telemetry/BzChart';
import DstChart from '../components/telemetry/DstChart';

import LoadingBar from '../components/ui/LoadingBar';

import { useSpaceWeather } from '../hooks/useSpaceWeather';
import { useTimezone } from '../hooks/useTimezone';
import SpaceWeatherMap from '../components/maps/SpaceWeatherMap';

function Dashboard() {
	const {
		weather,
		currentAlert,
		alerts,
		loading,
		weatherLoading,
		error,
		refresh,
	} = useSpaceWeather();

	console.log(weather);

	const { timezone, setTimezone } = useTimezone();

	const activeAlertsList =
		alerts && 'alerts' in alerts ? (alerts.alerts ?? []) : [];

	useEffect(() => {
		if (error) {
			toast.add({
				title: 'Data Fetch Error',
				description: error,
				type: 'error',
			});
		}
	}, [error]);

	return (
		<DashboardLayout>
			<div className="relative">
				<LoadingBar show={loading} />

				<DashboardHeader
					lastUpdated={weather?.timestamp}
					onRefresh={refresh}
					refreshing={loading}
					timezone={timezone}
					setTimezone={setTimezone}
				/>

				{/* Active Alert */}
				<AlertBanner alert={currentAlert?.active ? currentAlert.alert : null} />

				<div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
					<OverallRiskCard
						risk={weather?.risk ?? null}
						loading={weatherLoading}
					/>

					<RiskDrivers factors={weather?.risk?.primary_drivers ?? []} />
				</div>

				<div className="mt-8">
					<InfrastructureRiskGrid
						risks={weather?.risk?.infrastructure ?? []}
						loading={weatherLoading}
					/>
				</div>

				<section className="mt-10">
					<div className="mb-4">
						<p className="text-xs font-bold tracking-widest text-slate-400">
							LIVE TELEMETRY
						</p>

						<h2 className="mt-1 text-2xl font-black text-slate-900">
							Space Weather Conditions
						</h2>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<GeomagneticCard
							data={weather?.geomagnetic ?? null}
							loading={weatherLoading}
						/>

						<SolarWindCard
							data={weather?.solar_wind ?? null}
							loading={weatherLoading}
						/>

						<SolarActivityCard
							data={weather?.solar_activity ?? null}
							loading={weatherLoading}
						/>
					</div>
				</section>

				<section className="mt-10">
					<div className="mb-4">
						<p className="text-xs font-bold tracking-widest text-slate-400">
							TREND ANALYSIS
						</p>

						<h2 className="mt-1 text-2xl font-black text-slate-900">
							Space Weather Trends
						</h2>

						<p className="mt-1 text-sm text-slate-500">
							Historical telemetry and solar activity trends.
						</p>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						{/* Kp */}
						<KpChart data={weather?.geomagnetic?.kp_history ?? []} />

						{/* Solar Wind */}
						<SolarWindChart data={weather?.solar_wind?.history ?? []} />

						{/* X-Ray */}
						<XrayChart data={weather?.solar_activity?.xray_history ?? []} />

						{/* Bz */}
						<BzChart data={weather?.solar_wind?.bz_history ?? []} />

						{/* Dst */}
						<DstChart data={weather?.geomagnetic?.dst_history ?? []} />
					</div>
					<SpaceWeatherMap
						risks={weather?.risk?.infrastructure ?? []}
						locations={[]}
					/>
				</section>

				<div className="mt-10">
					<AlertList alerts={activeAlertsList} />
				</div>
			</div>
		</DashboardLayout>
	);
}

export default Dashboard;

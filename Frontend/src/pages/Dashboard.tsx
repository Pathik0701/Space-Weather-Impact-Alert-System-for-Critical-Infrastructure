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
import DstChart from '../components/telemetry/DstChart';
import LoadingBar from '../components/ui/LoadingBar';

import { useSpaceWeather } from '../hooks/useSpaceWeather';
import { useTimezone } from '../hooks/useTimezone';

import SpaceWeatherMap from '../components/maps/SpaceWeatherMap';

// AI assistant
import AIAssistantButton from '../components/ai/AIAssistantButton';

import Footer from '../components/Footer';

function Dashboard() {
	const {
		weather,
		mapData,
		currentAlert,
		alerts,
		loading,
		weatherLoading,
		error,
		refresh,
	} = useSpaceWeather();

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
				{/* Loading bar */}
				<LoadingBar show={loading} />

				{/* Dashboard header */}
				<DashboardHeader
					lastUpdated={weather?.timestamp}
					onRefresh={refresh}
					refreshing={loading}
					timezone={timezone}
					setTimezone={setTimezone}
				/>

				{/* Current alert banner */}
				<div className="mt-6">
					<AlertBanner
						alert={currentAlert?.active ? currentAlert.alert : null}
					/>
				</div>

				{/* Overall risk card with risk drivers */}
				<section className="mt-6">
					<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
						<div className="xl:col-span-5">
							<OverallRiskCard
								risk={weather?.risk ?? null}
								loading={weatherLoading}
							/>
						</div>

						<div className="xl:col-span-7">
							<RiskDrivers factors={weather?.risk?.primary_drivers ?? []} />
						</div>
					</div>
				</section>

				{/* Infrastructure risk grid */}
				<section className="mt-10">
					<div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
						<div>
							<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
								Critical Infrastructure
							</p>

							<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
								Impact Assessment
							</h2>

							<p className="mt-1 text-sm text-slate-500">
								Current space-weather exposure across critical sectors.
							</p>
						</div>

						<div className="text-xs font-semibold text-slate-400">
							{weather?.risk?.infrastructure?.length ?? 0} sectors monitored
						</div>
					</div>

					<InfrastructureRiskGrid
						risks={weather?.risk?.infrastructure ?? []}
						loading={weatherLoading}
					/>
				</section>

				{/* Live telemetry */}
				<section className="mt-12">
					<div className="mb-5">
						<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
							Live Telemetry
						</p>

						<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
							Space Weather Conditions
						</h2>

						<p className="mt-1 max-w-2xl text-sm text-slate-500">
							Current measurements from geomagnetic, solar wind, and solar
							activity data.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

				{/* Trend analysis charts */}
				<section className="mt-12">
					<div className="mb-5">
						<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
							Trend Analysis
						</p>

						<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
							Space Weather Trends
						</h2>

						<p className="mt-1 max-w-2xl text-sm text-slate-500">
							Historical telemetry and solar activity trends.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
						<KpChart data={weather?.geomagnetic?.kp_history ?? []} />

						<SolarWindChart data={weather?.solar_wind?.history ?? []} />

						<DstChart data={weather?.geomagnetic?.dst_history ?? []} />
					</div>
				</section>

				{/* Space weather map */}
				<section className="mt-12">
					<SpaceWeatherMap
						risks={weather?.risk?.infrastructure ?? []}
						mapData={mapData}
					/>
				</section>

				{/* AI assistant */}
				<AIAssistantButton />

				{/* All alerts list */}
				<section className="mt-12">
					<AlertList alerts={activeAlertsList} />
				</section>

				{/* Footer */}
				<Footer />
			</div>
		</DashboardLayout>
	);
}

export default Dashboard;

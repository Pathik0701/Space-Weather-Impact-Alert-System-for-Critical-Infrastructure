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
// import XrayChart from '../components/telemetry/XrayChart';
// import BzChart from '../components/telemetry/BzChart';
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

				{/* =====================================================
				    HEADER
				===================================================== */}
				<DashboardHeader
					lastUpdated={weather?.timestamp}
					onRefresh={refresh}
					refreshing={loading}
					timezone={timezone}
					setTimezone={setTimezone}
				/>

				{/* =====================================================
				    ACTIVE NOAA ALERT
				===================================================== */}
				<div className="mt-6">
					<AlertBanner
						alert={currentAlert?.active ? currentAlert.alert : null}
					/>
				</div>

				{/* =====================================================
				    RISK OVERVIEW
				===================================================== */}
				<section className="mt-6">
					<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
						{/* Overall Risk */}
						<div className="xl:col-span-5">
							<OverallRiskCard
								risk={weather?.risk ?? null}
								loading={weatherLoading}
							/>
						</div>

						{/* Primary Risk Drivers */}
						<div className="xl:col-span-7">
							<RiskDrivers factors={weather?.risk?.primary_drivers ?? []} />
						</div>
					</div>
				</section>

				{/* =====================================================
				    CRITICAL INFRASTRUCTURE
				===================================================== */}
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
							4 sectors monitored
						</div>
					</div>

					<InfrastructureRiskGrid
						risks={weather?.risk?.infrastructure ?? []}
						loading={weatherLoading}
					/>
				</section>

				{/* =====================================================
				    LIVE TELEMETRY
				===================================================== */}
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

				{/* =====================================================
				    TREND ANALYSIS
				===================================================== */}
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
						{/* 
						<XrayChart
							data={weather?.solar_activity?.xray_history ?? []}
						/>

						<BzChart
							data={weather?.solar_wind?.bz_history ?? []}
						/> */}

						<DstChart data={weather?.geomagnetic?.dst_history ?? []} />
					</div>
				</section>

				{/* =====================================================
				    SPACE WEATHER MAP
				===================================================== */}
				<section className="mt-12">
					<div className="mb-5">
						<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
							Geospatial Monitoring
						</p>

						<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
							Space Weather Impact Map
						</h2>

						<p className="mt-1 max-w-2xl text-sm text-slate-500">
							Geographic view of current infrastructure risk and space-weather
							impact.
						</p>
					</div>

					<SpaceWeatherMap
						risks={weather?.risk?.infrastructure ?? []}
						locations={[]}
					/>
				</section>

				{/* =====================================================
				    ALERT HISTORY
				===================================================== */}
				<section className="mt-12">
					<div className="mb-5">
						<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
							Alert Center
						</p>

						<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
							Recent Space Weather Alerts
						</h2>

						<p className="mt-1 max-w-2xl text-sm text-slate-500">
							Recent warnings and notifications received from the space-weather
							monitoring system.
						</p>
					</div>

					<AlertList alerts={activeAlertsList} />
				</section>

				{/* =====================================================
				    FOOTER
				===================================================== */}
				<footer className="mt-14 border-t border-slate-200 pt-5">
					<div className="flex flex-col justify-between gap-2 text-[10px] text-slate-400 sm:flex-row">
						<span>Space Weather Impact Alert System</span>

						<span>NOAA Space Weather Data • SWIAS v1.0</span>
					</div>
				</footer>
			</div>
		</DashboardLayout>
	);
}

export default Dashboard;

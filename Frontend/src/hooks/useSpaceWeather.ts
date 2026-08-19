import { useCallback, useEffect, useRef, useState } from 'react';

import {
	getCurrentAlert,
	getNOAAAlerts,
	getSpaceWeather,
} from '../services/api';

import type {
	CurrentAlertResponse,
	NOAAAlertsResponse,
	SpaceWeatherCurrent,
} from '../types/spaceWeather';

interface UseSpaceWeatherResult {
	weather: SpaceWeatherCurrent | null;
	alerts: NOAAAlertsResponse | null;
	currentAlert: CurrentAlertResponse | null;

	weatherLoading: boolean;
	alertsLoading: boolean;
	currentAlertLoading: boolean;

	loading: boolean;
	error: string | null;

	refresh: () => Promise<void>;
}

export function useSpaceWeather(): UseSpaceWeatherResult {
	const [weather, setWeather] = useState<SpaceWeatherCurrent | null>(null);

	const [alerts, setAlerts] = useState<NOAAAlertsResponse | null>(null);

	const [currentAlert, setCurrentAlert] = useState<CurrentAlertResponse | null>(
		null,
	);

	const [weatherLoading, setWeatherLoading] = useState(true);

	const [alertsLoading, setAlertsLoading] = useState(true);

	const [currentAlertLoading, setCurrentAlertLoading] = useState(true);

	const [error, setError] = useState<string | null>(null);

	const mounted = useRef(true);
	const refreshInFlight = useRef(false);

	useEffect(() => {
		mounted.current = true;

		return () => {
			mounted.current = false;
		};
	}, []);

	const refresh = useCallback(async () => {
		if (refreshInFlight.current) {
			return;
		}

		refreshInFlight.current = true;
		setError(null);

		setWeatherLoading(true);
		setAlertsLoading(true);
		setCurrentAlertLoading(true);

		try {
			const results = await Promise.allSettled([
				getSpaceWeather(),
				getNOAAAlerts(),
				getCurrentAlert(),
			]);

			if (!mounted.current) {
				return;
			}

			const [weatherResult, alertsResult, currentAlertResult] = results;

			if (weatherResult.status === 'fulfilled') {
				setWeather(weatherResult.value);
			} else {
				console.error('Weather request failed:', weatherResult.reason);
			}

			if (alertsResult.status === 'fulfilled') {
				setAlerts(alertsResult.value);
			} else {
				console.error('Alerts request failed:', alertsResult.reason);
			}

			if (currentAlertResult.status === 'fulfilled') {
				setCurrentAlert(currentAlertResult.value);
			} else {
				console.error(
					'Current alert request failed:',
					currentAlertResult.reason,
				);
			}

			const failed =
				results.filter((result) => result.status === 'rejected').length > 0;

			if (failed) {
				setError('Some space-weather data could not be loaded.');
			}
		} finally {
			refreshInFlight.current = false;

			if (mounted.current) {
				setWeatherLoading(false);
				setAlertsLoading(false);
				setCurrentAlertLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			void refresh();
		}, 0);

		return () => {
			window.clearTimeout(timer);
		};
	}, [refresh]);

	useEffect(() => {
		const interval = window.setInterval(
			() => {
				void refresh();
			},
			2 * 60 * 1000,
		);

		return () => {
			window.clearInterval(interval);
		};
	}, [refresh]);

	return {
		weather,
		alerts,
		currentAlert,

		weatherLoading,
		alertsLoading,
		currentAlertLoading,

		loading: weatherLoading || alertsLoading || currentAlertLoading,

		error,

		refresh,
	};
}

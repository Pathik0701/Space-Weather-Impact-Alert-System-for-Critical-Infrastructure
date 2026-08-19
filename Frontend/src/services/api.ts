import type {
	CurrentAlertResponse,
	NOAAAlertsResponse,
	SpaceWeatherCurrent,
} from '../types/spaceWeather';

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const REQUEST_TIMEOUT_MS = 20_000;

async function request<T>(endpoint: string): Promise<T> {
	const controller = new AbortController();
	const timeout = window.setTimeout(
		() => controller.abort(),
		REQUEST_TIMEOUT_MS,
	);

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			signal: controller.signal,
			headers: {
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		return await response.json();
	} finally {
		window.clearTimeout(timeout);
	}
}

export function getSpaceWeather() {
	return request<SpaceWeatherCurrent>('/api/weather/current');
}

export function getNOAAAlerts() {
	return request<NOAAAlertsResponse>('/api/alerts/noaa');
}

export function getCurrentAlert() {
	return request<CurrentAlertResponse>('/api/alerts/current');
}

export function getWeatherHistory(hours = 24) {
	return request(`/api/weather/history?hours=${hours}`);
}

export function getForecast() {
	return request('/api/weather/forecast');
}

export function getAurora() {
	return request('/api/geospace/aurora');
}

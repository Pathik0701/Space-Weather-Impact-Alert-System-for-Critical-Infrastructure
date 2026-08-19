import type { TimezoneOption } from '../hooks/useTimezone';

export function formatTime(
	value: string | null | undefined,
	timezone: TimezoneOption,
) {
	if (!value) {
		return '--';
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return '--';
	}

	const timeZone = timezone;

	return new Intl.DateTimeFormat('en-IN', {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
		day: '2-digit',
		month: 'short',
	}).format(date);
}

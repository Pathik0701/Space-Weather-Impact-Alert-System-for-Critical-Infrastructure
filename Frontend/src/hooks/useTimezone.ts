import { useState } from 'react';

export type TimezoneOption =
	| 'UTC'
	| 'Asia/Kolkata'
	| 'America/New_York'
	| 'Europe/London'
	| 'Asia/Tokyo';

const TIMEZONES: Record<TimezoneOption, string> = {
	UTC: 'UTC',
	'Asia/Kolkata': 'India Standard Time',
	'America/New_York': 'Eastern Time',
	'Europe/London': 'London',
	'Asia/Tokyo': 'Japan Standard Time',
};

export function useTimezone() {
	const [timezone, setTimezone] = useState<TimezoneOption>('Asia/Kolkata');

	return {
		timezone,
		setTimezone,
		timezones: TIMEZONES,
	};
}

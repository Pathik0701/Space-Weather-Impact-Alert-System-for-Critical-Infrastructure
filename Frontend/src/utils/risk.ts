import type { RiskLevel } from '../types/spaceWeather';

export function getRiskClasses(level: RiskLevel) {
	switch (level) {
		case 'CRITICAL':
			return {
				badge: 'bg-red-100 text-red-700',
				border: 'border-red-300',
				bar: 'bg-red-500',
			};

		case 'WARNING':
			return {
				badge: 'bg-orange-100 text-orange-700',
				border: 'border-orange-300',
				bar: 'bg-orange-500',
			};

		case 'ADVISORY':
			return {
				badge: 'bg-yellow-100 text-yellow-700',
				border: 'border-yellow-300',
				bar: 'bg-yellow-500',
			};

		case 'WATCH':
			return {
				badge: 'bg-blue-100 text-blue-700',
				border: 'border-blue-300',
				bar: 'bg-blue-500',
			};

		default:
			return {
				badge: 'bg-emerald-100 text-emerald-700',
				border: 'border-emerald-300',
				bar: 'bg-emerald-500',
			};
	}
}

interface LoadingBarProps {
	show: boolean;
}

function LoadingBar({ show }: LoadingBarProps) {
	if (!show) {
		return null;
	}

	return (
		<div className="absolute left-0 right-0 -top-3 z-50 h-1 overflow-hidden bg-slate-200">
			<div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] bg-slate-900" />
		</div>
	);
}

export default LoadingBar;

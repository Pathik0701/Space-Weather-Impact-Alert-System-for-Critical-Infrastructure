interface Props {
	className?: string;
}

function LoadingSkeleton({ className = '' }: Props) {
	return (
		<div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
	);
}

export default LoadingSkeleton;

import type { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

function DashboardLayout({ children }: Props) {
	return (
		<div className="min-h-screen bg-slate-50">
			<main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}

export default DashboardLayout;

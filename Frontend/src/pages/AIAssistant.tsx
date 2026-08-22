import { ArrowLeft, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/layout/DashboardLayout';
import AIChat from '../components/ai/AIChat';

function AIAssistant() {
	const navigate = useNavigate();

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-5xl">
				{/* Header */}
				<div className="mb-6">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
					>
						<ArrowLeft size={16} />
						Back to Dashboard
					</button>

					<div className="flex sm:flex-row flex-col items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
							<Bot size={24} />
						</div>

						<div>
							<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
								AI Intelligence
							</p>

							<h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
								Space Weather AI
							</h1>

							<p className="mt-1 text-sm text-slate-500">
								Ask questions about live space-weather conditions,
								infrastructure risk, and NOAA alerts.
							</p>
						</div>
					</div>
				</div>

				{/* AI Chat */}
				<AIChat />
			</div>
		</DashboardLayout>
	);
}

export default AIAssistant;

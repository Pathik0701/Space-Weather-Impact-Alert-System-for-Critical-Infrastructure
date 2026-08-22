import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AIAssistantButton() {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onClick={() => navigate('/ai-assistant')}
			aria-label="Open Space Weather AI Assistant"
			title="Space Weather AI"
			className="
				fixed
				bottom-6
				left-6
				z-[1000]
				flex
				h-14
				w-14
				items-center
				justify-center
				rounded-full
				bg-slate-950
				text-white
				shadow-xl
				ring-1
				ring-white/20
				transition-all
				duration-200
				hover:scale-105
				hover:bg-slate-800
				hover:shadow-2xl
				active:scale-95
			"
		>
			<Bot
				size={24}
				strokeWidth={2}
			/>
		</button>
	);
}

export default AIAssistantButton;

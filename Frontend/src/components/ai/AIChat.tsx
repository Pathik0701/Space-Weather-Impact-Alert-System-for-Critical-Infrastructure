import { useEffect, useRef, useState } from 'react';

import { Bot, Loader2, Send, User } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { AIChatHistoryItem } from '../../types/spaceWeather';
import { chatWithAI } from '../../services/api';

interface Message extends AIChatHistoryItem {
	id: string;
}

function AIChat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Ref to the actual scrollable chat container
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		const container = messagesContainerRef.current;

		if (!container) return;

		requestAnimationFrame(() => {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: 'smooth',
			});
		});
	};

	const sendMessage = async () => {
		const message = input.trim();

		if (!message || loading) {
			return;
		}

		setInput('');
		setError(null);

		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: message,
		};

		const updatedMessages = [...messages, userMessage];

		setMessages(updatedMessages);
		setLoading(true);

		try {
			const history = messages.map(({ role, content }) => ({
				role,
				content,
			}));

			const response = await chatWithAI(message, history);

			const assistantMessage: Message = {
				id: crypto.randomUUID(),
				role: 'assistant',
				content: response.answer,
			};

			setMessages((current) => [...current, assistantMessage]);
		} catch (err) {
			console.error('AI chat failed:', err);

			setError(
				err instanceof Error
					? err.message
					: 'Unable to connect to the AI service.',
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		void sendMessage();
	};

	/*
	 * Keep the latest message / loading indicator visible.
	 *
	 * requestAnimationFrame waits until React has rendered the
	 * new message before calculating scrollHeight.
	 */
	useEffect(() => {
		scrollToBottom();
	}, [messages, loading]);

	return (
		<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			{/* Header */}
			<div className="border-b border-slate-200 px-5 py-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
						<Bot size={20} />
					</div>

					<div>
						<p className="text-xs font-bold tracking-widest text-slate-400">
							AI ASSISTANT
						</p>

						<h2 className="text-lg font-black text-slate-900">
							Space Weather Intelligence
						</h2>
					</div>
				</div>

				<p className="mt-2 text-sm text-slate-500">
					Ask about current space weather, NOAA alerts, geomagnetic activity,
					solar wind, or infrastructure risk.
				</p>
			</div>

			{/* Messages */}
			<div
				ref={messagesContainerRef}
				className="min-h-[320px] max-h-[500px] space-y-4 overflow-y-auto p-5"
			>
				{/* Empty state */}
				{messages.length === 0 && (
					<div className="flex min-h-[280px] items-center justify-center text-center">
						<div className="max-w-md">
							<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
								<Bot
									size={26}
									className="text-slate-600"
								/>
							</div>

							<h3 className="mt-4 font-black text-slate-900">
								Ask the Space Weather AI
							</h3>

							<p className="mt-2 text-sm text-slate-500">Try asking:</p>

							<div className="mt-3 space-y-2 text-sm text-slate-600">
								<p>"What is the current Kp?"</p>
								<p>"What is the current solar wind speed?"</p>
								<p>"Are there any active NOAA alerts?"</p>
								<p>"What is the current infrastructure risk?"</p>
							</div>
						</div>
					</div>
				)}

				{/* Messages */}
				{messages.map((message) => {
					const isUser = message.role === 'user';

					return (
						<div
							key={message.id}
							className={`flex gap-3 ${
								isUser ? 'justify-end' : 'justify-start'
							}`}
						>
							{/* Assistant avatar */}
							{!isUser && (
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
									<Bot size={16} />
								</div>
							)}

							{/* Message */}
							<div
								className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
									isUser
										? 'bg-slate-900 text-white'
										: 'bg-slate-100 text-slate-700'
								}`}
							>
								{isUser ? (
									<p className="whitespace-pre-wrap">{message.content}</p>
								) : (
									<div className="ai-markdown">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											components={{
												h1: ({ children }) => (
													<h1 className="mb-3 mt-1 text-lg font-black text-slate-900">
														{children}
													</h1>
												),

												h2: ({ children }) => (
													<h2 className="mb-2 mt-4 text-base font-black text-slate-900">
														{children}
													</h2>
												),

												h3: ({ children }) => (
													<h3 className="mb-2 mt-3 text-sm font-black text-slate-900">
														{children}
													</h3>
												),

												p: ({ children }) => (
													<p className="mb-3 last:mb-0">{children}</p>
												),

												strong: ({ children }) => (
													<strong className="font-bold text-slate-900">
														{children}
													</strong>
												),

												em: ({ children }) => (
													<em className="italic">{children}</em>
												),

												ul: ({ children }) => (
													<ul className="mb-3 ml-5 list-disc space-y-1">
														{children}
													</ul>
												),

												ol: ({ children }) => (
													<ol className="mb-3 ml-5 list-decimal space-y-1">
														{children}
													</ol>
												),

												li: ({ children }) => (
													<li className="pl-1">{children}</li>
												),

												blockquote: ({ children }) => (
													<blockquote className="my-3 border-l-4 border-slate-300 pl-3 italic text-slate-500">
														{children}
													</blockquote>
												),

												code: ({ children }) => (
													<code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-800">
														{children}
													</code>
												),

												table: ({ children }) => (
													<div className="my-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
														<table className="w-full border-collapse text-xs">
															{children}
														</table>
													</div>
												),

												thead: ({ children }) => (
													<thead className="bg-slate-200 text-slate-800">
														{children}
													</thead>
												),

												th: ({ children }) => (
													<th className="border-b border-slate-300 px-3 py-2 text-left font-bold">
														{children}
													</th>
												),

												td: ({ children }) => (
													<td className="border-b border-slate-200 px-3 py-2 align-top">
														{children}
													</td>
												),

												hr: () => <hr className="my-4 border-slate-200" />,
											}}
										>
											{message.content}
										</ReactMarkdown>
									</div>
								)}
							</div>

							{/* User avatar */}
							{isUser && (
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
									<User size={16} />
								</div>
							)}
						</div>
					);
				})}

				{/* Loading */}
				{loading && (
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
							<Bot size={16} />
						</div>

						<div className="rounded-2xl bg-slate-100 px-4 py-3">
							<div className="flex items-center gap-2 text-sm text-slate-500">
								<Loader2
									size={16}
									className="animate-spin"
								/>

								<span>Analyzing space-weather data...</span>
							</div>
						</div>
					</div>
				)}

				{/* Error */}
				{error && (
					<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				)}
			</div>

			{/* Input */}
			<form
				onSubmit={handleSubmit}
				className="border-t border-slate-200 p-4"
			>
				<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-slate-400">
					<input
						value={input}
						onChange={(event) => setInput(event.target.value)}
						placeholder="Ask about space weather..."
						disabled={loading}
						className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
					/>

					<button
						type="submit"
						disabled={!input.trim() || loading}
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{loading ? (
							<Loader2
								size={18}
								className="animate-spin"
							/>
						) : (
							<Send size={18} />
						)}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AIChat;

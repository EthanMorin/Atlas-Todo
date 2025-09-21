import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon, SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { BoardColumn } from './components/BoardColumn';
import { InlineEditableText } from './components/InlineEditableText';
import { useBoardStore } from './hooks/useBoardStore';
import { ColumnTheme } from './lib/types';

const themeOptions: { id: ColumnTheme; label: string; swatch: string }[] = [
	{ id: 'sky', label: 'Sky', swatch: 'from-sky-400 via-sky-500 to-sky-600' },
	{
		id: 'violet',
		label: 'Violet',
		swatch: 'from-violet-400 via-violet-500 to-violet-600',
	},
	{
		id: 'emerald',
		label: 'Emerald',
		swatch: 'from-emerald-400 via-emerald-500 to-emerald-600',
	},
	{
		id: 'amber',
		label: 'Amber',
		swatch: 'from-amber-400 via-amber-500 to-amber-600',
	},
	{
		id: 'rose',
		label: 'Rose',
		swatch: 'from-rose-400 via-rose-500 to-rose-600',
	},
	{
		id: 'slate',
		label: 'Slate',
		swatch: 'from-slate-500 via-slate-600 to-slate-700',
	},
];

export default function App() {
	const {
		boardTitle,
		columns,
		setBoardTitle,
		addColumn,
		updateColumn,
		deleteColumn,
		addCard,
		updateCard,
		deleteCard,
		moveCard,
	} = useBoardStore();

	const [isDarkMode, setIsDarkMode] = useState(true);
	const [columnTitle, setColumnTitle] = useState('Ideas Backlog');
	const [selectedTheme, setSelectedTheme] = useState<ColumnTheme>('rose');

	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', isDarkMode);
		}
	}, [isDarkMode]);

	const columnGrid = columns;

	return (
		<div
			className={clsx(
				'relative min-h-screen overflow-hidden bg-slate-100 text-slate-900 transition-colors duration-500 ease-out',
				isDarkMode && 'bg-slate-950 text-slate-100'
			)}
		>
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute bottom-10 right-0 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
				<div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-3xl" />
			</div>

			<div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:gap-12 lg:px-12 lg:py-10">
				<header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/60 p-4 shadow-elevated backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:rounded-3xl sm:p-6 lg:p-8">
					<div className="flex items-start gap-3 sm:gap-5">
						<div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 text-white shadow-lg sm:h-12 sm:w-12 sm:rounded-2xl">
							<SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
						</div>
						<div className="space-y-1 sm:space-y-2">
							<InlineEditableText
								value={boardTitle}
								onSubmit={setBoardTitle}
								className="max-w-xl text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl lg:text-3xl"
								maxLength={54}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between gap-3 sm:gap-4">
						<button
							type="button"
							onClick={() => setIsDarkMode((mode) => !mode)}
							className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-elevated dark:bg-white dark:text-slate-900 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
						>
							{isDarkMode ? (
								<SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
							) : (
								<MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
							)}
							<span className="hidden sm:inline">
								{isDarkMode ? 'Light mode' : 'Dark mode'}
							</span>
						</button>
					</div>
				</header>

				<main className="flex flex-1 flex-col gap-4 sm:gap-6 lg:gap-8">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 sm:text-sm sm:tracking-[0.4em]">
								Flow roadmap
							</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-base lg:text-lg">
								Drag and drop cards between milestones, or tap a card to enrich
								it with context.
							</p>
						</div>
					</div>

					<div className="relative">
						<div className="scrollbar-thin flex gap-3 overflow-x-auto pb-4 pr-4 sm:gap-4 sm:pb-6 sm:pr-6 lg:gap-6">
							{columnGrid.map((column) => (
								<BoardColumn
									key={column.id}
									column={column}
									columns={columns}
									onUpdateColumn={updateColumn}
									onDeleteColumn={deleteColumn}
									onAddCard={addCard}
									onUpdateCard={updateCard}
									onDeleteCard={deleteCard}
									onMoveCard={moveCard}
								/>
							))}

							<form
								onSubmit={(event) => {
									event.preventDefault();
									if (!columnTitle.trim()) return;
									addColumn(columnTitle.trim(), selectedTheme);
									setColumnTitle('');
								}}
								className="flex w-[280px] shrink-0 flex-col gap-3 rounded-2xl border border-dashed border-white/30 bg-white/30 p-4 text-left backdrop-blur dark:border-slate-700 dark:bg-slate-900/40 sm:w-[300px] sm:gap-4 sm:rounded-3xl sm:p-6"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-sm sm:tracking-[0.25em]">
									New column
								</p>
								<input
									value={columnTitle}
									onChange={(event) => setColumnTitle(event.target.value)}
									placeholder="Column name"
									className="w-full rounded-xl border border-transparent bg-white/90 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-900/60 dark:text-slate-200 dark:focus:ring-indigo-500 dark:focus:ring-offset-slate-950 sm:rounded-2xl sm:px-4 sm:py-3"
								/>
								<div className="space-y-2">
									<p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 sm:tracking-[0.3em]">
										Theme
									</p>
									<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
										{themeOptions.map((theme) => (
											<button
												key={theme.id}
												type="button"
												onClick={() => setSelectedTheme(theme.id)}
												className={clsx(
													'group relative flex h-12 flex-col items-center justify-center gap-1 rounded-xl border border-transparent bg-white/60 p-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/60 dark:text-slate-300 sm:h-14 sm:gap-2 sm:rounded-2xl sm:p-2',
													selectedTheme === theme.id &&
														'border-indigo-400 text-indigo-500 shadow-lg dark:border-indigo-500 dark:text-indigo-300'
												)}
											>
												<span
													className={clsx(
														'h-1.5 w-12 rounded-full bg-gradient-to-r sm:h-2 sm:w-16',
														theme.swatch
													)}
												/>
												<span className="text-xs sm:text-xs">
													{theme.label}
												</span>
											</button>
										))}
									</div>
								</div>
								<button
									type="submit"
									className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-500 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
								>
									Create column
								</button>
							</form>
						</div>
					</div>
				</main>

				<footer className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-4 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-600 sm:gap-4 sm:py-6 lg:flex-row lg:py-8">
					<p className="text-center">
						&copy; {new Date().getFullYear()} Ethan Morin
					</p>
				</footer>
			</div>
		</div>
	);
}

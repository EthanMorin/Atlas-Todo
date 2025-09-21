import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { Card, Column, ColumnTheme } from '../lib/types';
import { InlineEditableText } from './InlineEditableText';
import { CardItem } from './CardItem';
import { useBoardStore } from '../hooks/useBoardStore';

interface BoardColumnProps {
	column: Column;
	columns: Column[];
	onUpdateColumn: (id: string, payload: Partial<Column>) => void;
	onDeleteColumn: (id: string) => void;
	onAddCard: (
		columnId: string,
		card: Pick<Card, 'title' | 'description' | 'tags'>
	) => void;
	onUpdateCard: (
		columnId: string,
		cardId: string,
		payload: Partial<Card>
	) => void;
	onDeleteCard: (columnId: string, cardId: string) => void;
	onMoveCard: (
		fromColumnId: string,
		toColumnId: string,
		cardId: string,
		position?: number
	) => void;
}

const themeStyles: Record<
	ColumnTheme,
	{ accent: string; badge: string; border: string }
> = {
	sky: {
		accent: 'rgba(59, 130, 246, 0.8)',
		badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
		border: 'border-blue-300 dark:border-blue-600',
	},
	amber: {
		accent: 'rgba(245, 158, 11, 0.8)',
		badge:
			'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
		border: 'border-yellow-300 dark:border-yellow-600',
	},
	violet: {
		accent: 'rgba(139, 92, 246, 0.8)',
		badge:
			'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
		border: 'border-purple-300 dark:border-purple-600',
	},
	emerald: {
		accent: 'rgba(16, 185, 129, 0.8)',
		badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
		border: 'border-green-300 dark:border-green-600',
	},
	rose: {
		accent: 'rgba(244, 63, 94, 0.8)',
		badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
		border: 'border-pink-300 dark:border-pink-600',
	},
	slate: {
		accent: 'rgba(100, 116, 139, 0.8)',
		badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200',
		border: 'border-gray-300 dark:border-gray-600',
	},
};

export function BoardColumn({
	column,
	columns,
	onUpdateColumn,
	onDeleteColumn,
	onAddCard,
	onUpdateCard,
	onDeleteCard,
	onMoveCard,
}: BoardColumnProps) {
	const [isAddingCard, setIsAddingCard] = useState(false);
	const [cardTitle, setCardTitle] = useState('');
	const [cardDescription, setCardDescription] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const listRef = useRef<HTMLDivElement | null>(null);

	const { availableTags } = useBoardStore();

	const handleAddCard = () => {
		if (!cardTitle.trim()) return;
		onAddCard(column.id, {
			title: cardTitle.trim(),
			description: cardDescription.trim() || undefined,
			tags: selectedTags,
		});
		setCardTitle('');
		setCardDescription('');
		setSelectedTags([]);
		setIsAddingCard(false);
	};

	const handleToggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	const theme = themeStyles[column.theme];

	return (
		<section
			className={clsx(
				'relative flex w-[280px] shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:w-[300px] sm:gap-4 sm:rounded-3xl sm:p-6'
			)}
		>
			<header className="mt-1 flex items-start justify-between gap-2 sm:mt-2 sm:gap-3">
				<div className="space-y-1">
					<InlineEditableText
						value={column.title}
						onSubmit={(title) => onUpdateColumn(column.id, { title })}
						className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg"
						maxLength={36}
					/>
					<span
						className={clsx(
							'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide sm:px-3 sm:py-1',
							theme.badge
						)}
					>
						{column.cards.length} {column.cards.length === 1 ? 'card' : 'cards'}
					</span>
				</div>
				<button
					type="button"
					onClick={() => onDeleteColumn(column.id)}
					className="rounded-full border border-slate-300 bg-slate-100 p-1.5 text-slate-400 transition hover:border-rose-300 hover:text-rose-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500 dark:hover:text-rose-300 sm:p-2"
					aria-label="Delete column"
				>
					<TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
				</button>
			</header>

			<div
				ref={listRef}
				className={clsx(
					'flex flex-1 flex-col gap-3 overflow-y-auto pb-3 scrollbar-thin rounded-xl sm:gap-4 sm:pb-4 sm:rounded-2xl',
					isDragOver &&
						'ring-2 ring-indigo-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
				)}
				onDragOver={(event) => {
					if (event.dataTransfer.types.includes('application/atlasflow-card')) {
						event.preventDefault();
						event.dataTransfer.dropEffect = 'move';
					}
				}}
				onDragEnter={(event) => {
					if (event.dataTransfer.types.includes('application/atlasflow-card')) {
						setIsDragOver(true);
					}
				}}
				onDragLeave={(event) => {
					if (!event.dataTransfer.types.includes('application/atlasflow-card'))
						return;
					const relatedTarget = event.relatedTarget as Node | null;
					if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
						setIsDragOver(false);
					}
				}}
				onDrop={(event) => {
					if (!event.dataTransfer.types.includes('application/atlasflow-card'))
						return;
					event.preventDefault();
					setIsDragOver(false);
					const payload = event.dataTransfer.getData(
						'application/atlasflow-card'
					);
					if (!payload) return;

					try {
						const { cardId, fromColumnId } = JSON.parse(payload) as {
							cardId: string;
							fromColumnId: string;
						};

						if (!cardId || !fromColumnId) return;

						let insertionIndex: number | undefined;
						const container = listRef.current;
						if (container) {
							const cardElements = Array.from(
								container.querySelectorAll<HTMLElement>('[data-card-id]')
							);
							const cursorY = event.clientY;
							insertionIndex = cardElements.length;

							for (let index = 0; index < cardElements.length; index += 1) {
								const rect = cardElements[index].getBoundingClientRect();
								if (cursorY < rect.top + rect.height / 2) {
									insertionIndex = index;
									break;
								}
							}
						}

						onMoveCard(fromColumnId, column.id, cardId, insertionIndex);
					} catch (error) {
						console.error('Failed to parse drag payload', error);
					}
				}}
			>
				{column.cards.map((card) => (
					<CardItem
						key={card.id}
						card={card}
						columnId={column.id}
						columns={columns}
						onUpdate={onUpdateCard}
						onDelete={onDeleteCard}
						onMove={onMoveCard}
					/>
				))}
			</div>

			<div
				className={clsx(
					'rounded-xl border border-dashed p-3 transition sm:rounded-2xl sm:p-4',
					theme.border
				)}
			>
				{isAddingCard ? (
					<form
						onSubmit={(event) => {
							event.preventDefault();
							handleAddCard();
						}}
						className="space-y-2 sm:space-y-3"
					>
						<input
							value={cardTitle}
							onChange={(event) => setCardTitle(event.target.value)}
							placeholder="Card title"
							className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900 sm:rounded-xl sm:px-4"
						/>
						<textarea
							value={cardDescription}
							onChange={(event) => setCardDescription(event.target.value)}
							placeholder="Add more context"
							rows={2}
							className="w-full resize-none rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900 sm:rounded-xl sm:px-4 sm:rows-3"
						/>

						{/* Tag Selection */}
						<div className="space-y-2">
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
								Tags (optional)
							</p>
							<div className="flex flex-wrap gap-1.5">
								{availableTags.map((tag) => {
									const isSelected = selectedTags.includes(tag);
									return (
										<button
											key={tag}
											type="button"
											onClick={() => handleToggleTag(tag)}
											className={clsx(
												'rounded-full border px-2 py-0.5 text-xs font-medium transition sm:px-3 sm:py-1',
												isSelected
													? 'border-indigo-400 bg-indigo-100 text-indigo-700 hover:border-indigo-500 hover:bg-indigo-200 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200 dark:hover:bg-indigo-500/30'
													: 'border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300'
											)}
										>
											{isSelected ? '✓' : '#'}
											{tag}
										</button>
									);
								})}
							</div>
						</div>

						<div className="flex items-center justify-between gap-2">
							<button
								type="submit"
								className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
							>
								Add card
							</button>
							<button
								type="button"
								onClick={() => {
									setIsAddingCard(false);
									setCardTitle('');
									setCardDescription('');
									setSelectedTags([]);
								}}
								className="text-xs font-medium text-slate-400 transition hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 sm:text-sm"
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<button
						type="button"
						onClick={() => setIsAddingCard(true)}
						className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white/40 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300 sm:gap-2 sm:rounded-xl sm:py-3 sm:text-sm"
					>
						<PlusCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" /> Add a card
					</button>
				)}
			</div>
		</section>
	);
}

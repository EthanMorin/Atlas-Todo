import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import type { DragEvent } from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Card, Column } from '../lib/types';
import { useBoardStore } from '../hooks/useBoardStore';

interface CardItemProps {
	card: Card;
	columnId: string;
	columns: Column[];
	onUpdate: (columnId: string, cardId: string, payload: Partial<Card>) => void;
	onDelete: (columnId: string, cardId: string) => void;
	onMove: (fromColumnId: string, toColumnId: string, cardId: string) => void;
}

const tagPalette: Record<string, string> = {
	work: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
	personal: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
	health: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
	urgent:
		'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
	'low-priority':
		'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200',
	shopping:
		'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
};

// Color options for dynamically generated tags
const dynamicTagColors = [
	'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200',
	'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-200',
	'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
	'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
	'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
	'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
	'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-200',
	'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
];

const fallbackTagClass =
	'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';

// Function to get a consistent color for a tag based on its name
const getTagColor = (tag: string): string => {
	if (tagPalette[tag]) {
		return tagPalette[tag];
	}

	// Generate a consistent color based on the tag name
	let hash = 0;
	for (let i = 0; i < tag.length; i++) {
		hash = tag.charCodeAt(i) + ((hash << 5) - hash);
	}
	const colorIndex = Math.abs(hash) % dynamicTagColors.length;
	return dynamicTagColors[colorIndex];
};

export function CardItem({
	card,
	columnId,
	columns,
	onUpdate,
	onDelete,
	onMove,
}: CardItemProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [newTagInput, setNewTagInput] = useState('');
	const [showNewTagInput, setShowNewTagInput] = useState(false);

	const { availableTags, addTag, removeTag } = useBoardStore();

	const handleMove = (targetColumnId: string) => {
		if (targetColumnId === columnId) return;
		onMove(columnId, targetColumnId, card.id);
	};

	const handleDragStart = (event: DragEvent<HTMLElement>) => {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData(
			'application/atlasflow-card',
			JSON.stringify({ cardId: card.id, fromColumnId: columnId })
		);
		event.dataTransfer.setData('text/plain', card.title);
		setIsDragging(true);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	const handleCreateTag = () => {
		const trimmedTag = newTagInput.trim().toLowerCase();
		if (trimmedTag && !availableTags.includes(trimmedTag)) {
			addTag(trimmedTag);
			const tags = Array.from(new Set([...card.tags, trimmedTag]));
			onUpdate(columnId, card.id, { tags });
			setNewTagInput('');
			setShowNewTagInput(false);
		}
	};

	const handleToggleTag = (tag: string) => {
		if (card.tags.includes(tag)) {
			// Remove tag if it's already on the card
			const tags = card.tags.filter((t) => t !== tag);
			onUpdate(columnId, card.id, { tags });
		} else {
			// Add tag if it's not on the card
			const tags = Array.from(new Set([...card.tags, tag]));
			onUpdate(columnId, card.id, { tags });
		}
	};

	const handleDeleteTag = (tag: string, event: React.MouseEvent) => {
		event.stopPropagation(); // Prevent toggling the tag
		if (
			confirm(
				`Are you sure you want to delete the tag "${tag}"? This will remove it from all cards.`
			)
		) {
			removeTag(tag);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleCreateTag();
		} else if (e.key === 'Escape') {
			setNewTagInput('');
			setShowNewTagInput(false);
		}
	};

	return (
		<article
			data-card-id={card.id}
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			className={clsx(
				'group relative overflow-hidden rounded-xl bg-white p-3 border border-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 sm:rounded-2xl sm:p-4',
				isDragging && 'opacity-60'
			)}
		>
			<div className="flex items-start justify-between gap-2 sm:gap-3">
				<InlineEditableText
					value={card.title}
					onSubmit={(title) => onUpdate(columnId, card.id, { title })}
					className="text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base"
					maxLength={80}
				/>
				<Menu as="div" className="relative">
					<Menu.Button className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200 sm:p-1">
						<EllipsisHorizontalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
					</Menu.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-95 opacity-0"
					>
						<Menu.Items className="absolute right-0 z-10 mt-1 w-36 origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-800 sm:mt-2 sm:w-44 sm:rounded-xl sm:text-sm">
							<div className="px-2 py-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
								Move to
							</div>
							{columns.map((column) => (
								<Menu.Item key={column.id}>
									{({ active }) => (
										<button
											type="button"
											onClick={() => handleMove(column.id)}
											className={clsx(
												'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-600 transition dark:text-slate-200',
												active &&
													'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
												column.id === columnId &&
													'text-slate-400 dark:text-slate-500'
											)}
										>
											<span className="truncate">{column.title}</span>
											{column.id === columnId && (
												<span className="text-xs uppercase tracking-wide">
													Current
												</span>
											)}
										</button>
									)}
								</Menu.Item>
							))}
							<div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
							<Menu.Item>
								{({ active }) => (
									<button
										type="button"
										onClick={() => onDelete(columnId, card.id)}
										className={clsx(
											'w-full rounded-lg px-3 py-2 text-left text-rose-500 transition',
											active &&
												'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
										)}
									>
										Remove card
									</button>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</Menu>
			</div>

			{card.tags.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
					{card.tags.map((tag) => (
						<span
							key={tag}
							className={clsx(
								'rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide sm:px-3 sm:py-1',
								getTagColor(tag)
							)}
						>
							{tag}
						</span>
					))}
				</div>
			)}

			<div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-300 sm:mt-3 sm:space-y-2 sm:text-sm">
				<InlineEditableText
					value={card.description ?? ''}
					onSubmit={(description) =>
						onUpdate(columnId, card.id, { description })
					}
					placeholder="Write a description"
					multiline
					className="text-xs font-normal leading-relaxed text-slate-500 dark:text-slate-300 sm:text-sm"
					maxLength={220}
				/>
			</div>

			<div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 sm:mt-4">
				<span className="text-xs sm:text-xs">
					{new Date(card.createdAt).toLocaleDateString()}
				</span>
				<button
					type="button"
					onClick={() => setIsExpanded((state) => !state)}
					className="text-xs font-medium text-indigo-500 transition hover:text-indigo-400 sm:text-xs"
				>
					{isExpanded ? 'Hide details' : 'Quick add tag'}
				</button>
			</div>

			{isExpanded && (
				<div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
					{availableTags.map((tag) => {
						const isSelected = card.tags.includes(tag);
						return (
							<div
								key={tag}
								className="group relative inline-flex items-center"
							>
								<button
									type="button"
									onClick={() => handleToggleTag(tag)}
									className={clsx(
										'rounded-full border px-2 py-0.5 pr-5 text-xs font-medium transition sm:px-3 sm:py-1 sm:pr-6',
										isSelected
											? 'border-indigo-400 bg-indigo-100 text-indigo-700 hover:border-indigo-500 hover:bg-indigo-200 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200 dark:hover:bg-indigo-500/30'
											: 'border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300'
									)}
								>
									{isSelected ? '✓' : '#'}
									{tag}
								</button>
								<button
									type="button"
									onClick={(e) => handleDeleteTag(tag, e)}
									className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 opacity-0 transition hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 sm:right-1"
									title={`Delete tag "${tag}"`}
								>
									<svg
										className="h-2.5 w-2.5 sm:h-3 sm:w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						);
					})}

					{showNewTagInput ? (
						<div className="flex items-center gap-1">
							<input
								type="text"
								value={newTagInput}
								onChange={(e) => setNewTagInput(e.target.value)}
								onKeyDown={handleKeyPress}
								placeholder="New tag..."
								className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:px-3 sm:py-1"
								autoFocus
							/>
							<button
								type="button"
								onClick={handleCreateTag}
								className="rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-400 sm:px-3 sm:py-1"
							>
								Add
							</button>
							<button
								type="button"
								onClick={() => {
									setNewTagInput('');
									setShowNewTagInput(false);
								}}
								className="rounded-full bg-slate-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-400 sm:px-3 sm:py-1"
							>
								Cancel
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => setShowNewTagInput(true)}
							className="rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-400 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-600 dark:text-slate-500 dark:hover:border-indigo-500 dark:hover:text-indigo-300 sm:px-3 sm:py-1"
						>
							+ New tag
						</button>
					)}

					{card.tags.length > 0 && (
						<button
							type="button"
							onClick={() => onUpdate(columnId, card.id, { tags: [] })}
							className="rounded-full border border-transparent bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-400 sm:px-3 sm:py-1"
						>
							Clear all tags
						</button>
					)}
				</div>
			)}
		</article>
	);
}

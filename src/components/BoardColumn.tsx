import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import clsx from 'clsx';
import { Card, Column, ColumnTheme } from '../lib/types.ts';
import { InlineEditableText } from './InlineEditableText.tsx';
import { CardItem } from './CardItem.tsx';

interface BoardColumnProps {
  column: Column;
  columns: Column[];
  onUpdateColumn: (id: string, payload: Partial<Column>) => void;
  onDeleteColumn: (id: string) => void;
  onAddCard: (columnId: string, card: Pick<Card, 'title' | 'description' | 'tags'>) => void;
  onUpdateCard: (columnId: string, cardId: string, payload: Partial<Card>) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onMoveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void;
}

const themeStyles: Record<ColumnTheme, { accent: string; badge: string; border: string }> = {
  sky: {
    accent: 'rgba(125, 211, 252, 0.95), rgba(14, 165, 233, 0.9), rgba(59, 130, 246, 0.85)',
    badge: 'bg-sky-500/20 text-sky-500',
    border: 'border-sky-500/30'
  },
  amber: {
    accent: 'rgba(253, 230, 138, 0.95), rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.85)',
    badge: 'bg-amber-500/20 text-amber-500',
    border: 'border-amber-500/30'
  },
  violet: {
    accent: 'rgba(221, 214, 254, 0.95), rgba(167, 139, 250, 0.9), rgba(129, 140, 248, 0.85)',
    badge: 'bg-violet-500/20 text-violet-400',
    border: 'border-violet-500/30'
  },
  emerald: {
    accent: 'rgba(134, 239, 172, 0.95), rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.85)',
    badge: 'bg-emerald-500/20 text-emerald-500',
    border: 'border-emerald-500/30'
  },
  rose: {
    accent: 'rgba(254, 205, 211, 0.95), rgba(244, 114, 182, 0.9), rgba(190, 24, 93, 0.85)',
    badge: 'bg-rose-500/20 text-rose-500',
    border: 'border-rose-500/30'
  },
  slate: {
    accent: 'rgba(203, 213, 225, 0.95), rgba(148, 163, 184, 0.9), rgba(100, 116, 139, 0.85)',
    badge: 'bg-slate-500/20 text-slate-400',
    border: 'border-slate-500/30'
  }
};

export function BoardColumn({
  column,
  columns,
  onUpdateColumn,
  onDeleteColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard
}: BoardColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');

  const handleAddCard = () => {
    if (!cardTitle.trim()) return;
    onAddCard(column.id, {
      title: cardTitle.trim(),
      description: cardDescription.trim() || undefined,
      tags: []
    });
    setCardTitle('');
    setCardDescription('');
    setIsAddingCard(false);
  };

  const theme = themeStyles[column.theme];

  return (
    <section
      className={clsx(
        'relative flex w-[330px] shrink-0 flex-col gap-4 rounded-3xl border border-white/10 bg-white/50 p-6 shadow-elevated backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
        'transition hover:-translate-y-1 hover:shadow-[0_22px_60px_-35px_rgba(79,70,229,0.45)]'
      )}
    >
      <div
        className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r opacity-70"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 35%), linear-gradient(120deg, ${
            theme.accent
          })`
        }}
      />
      <header className="mt-2 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <InlineEditableText
            value={column.title}
            onSubmit={(title) => onUpdateColumn(column.id, { title })}
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            maxLength={36}
          />
          <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide', theme.badge)}>
            {column.cards.length} {column.cards.length === 1 ? 'card' : 'cards'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDeleteColumn(column.id)}
          className="rounded-full border border-transparent bg-white/60 p-2 text-slate-400 shadow-sm transition hover:border-rose-200 hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-slate-800/80 dark:text-slate-500 dark:hover:text-rose-300 dark:focus-visible:ring-offset-slate-900"
          aria-label="Delete column"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4 scrollbar-thin">
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

      <div className={clsx('rounded-2xl border border-dashed p-4 transition', theme.border)}>
        {isAddingCard ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddCard();
            }}
            className="space-y-3"
          >
            <input
              value={cardTitle}
              onChange={(event) => setCardTitle(event.target.value)}
              placeholder="Card title"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900"
            />
            <textarea
              value={cardDescription}
              onChange={(event) => setCardDescription(event.target.value)}
              placeholder="Add more context"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setCardTitle('');
                  setCardDescription('');
                }}
                className="text-sm font-medium text-slate-400 transition hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/40 py-3 text-sm font-semibold text-slate-500 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <PlusCircleIcon className="h-5 w-5" /> Add a card
          </button>
        )}
      </div>
    </section>
  );
}

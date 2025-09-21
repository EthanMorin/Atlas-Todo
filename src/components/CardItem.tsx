import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import type { DragEvent } from 'react';
import { InlineEditableText } from './InlineEditableText.tsx';
import { Card, Column } from '../lib/types.ts';

interface CardItemProps {
  card: Card;
  columnId: string;
  columns: Column[];
  onUpdate: (columnId: string, cardId: string, payload: Partial<Card>) => void;
  onDelete: (columnId: string, cardId: string) => void;
  onMove: (fromColumnId: string, toColumnId: string, cardId: string) => void;
}

const tagPalette: Record<string, string> = {
  research: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  analytics: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  ux: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200',
  visual: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  responsive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  frontend: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
};

const fallbackTagClass = 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200';

export function CardItem({ card, columnId, columns, onUpdate, onDelete, onMove }: CardItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <article
      data-card-id={card.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={clsx(
        'group relative overflow-hidden rounded-2xl bg-white/70 p-4 shadow-card backdrop-blur transition hover:-translate-y-1 hover:shadow-elevated dark:bg-slate-800/70 dark:shadow-none',
        isDragging && 'opacity-60'
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-indigo-200/30 dark:from-white/5 dark:to-indigo-500/10" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <InlineEditableText
          value={card.title}
          onSubmit={(title) => onUpdate(columnId, card.id, { title })}
          className="text-base font-semibold text-slate-800 dark:text-slate-100"
          maxLength={80}
        />
        <Menu as="div" className="relative">
          <Menu.Button className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 dark:text-slate-500 dark:hover:bg-slate-700/80 dark:hover:text-slate-200">
            <EllipsisHorizontalIcon className="h-5 w-5" />
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white/95 p-1 text-sm shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
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
                        active && 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200',
                        column.id === columnId && 'text-slate-400 dark:text-slate-500'
                      )}
                    >
                      <span className="truncate">{column.title}</span>
                      {column.id === columnId && (
                        <span className="text-xs uppercase tracking-wide">Current</span>
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
                      active && 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200'
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
        <div className="mt-3 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                tagPalette[tag] ?? fallbackTagClass
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-300">
        <InlineEditableText
          value={card.description ?? ''}
          onSubmit={(description) => onUpdate(columnId, card.id, { description })}
          placeholder="Write a description"
          multiline
          className="text-sm font-normal leading-relaxed text-slate-500 dark:text-slate-300"
          maxLength={220}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>{new Date(card.createdAt).toLocaleDateString()}</span>
        <button
          type="button"
          onClick={() => setIsExpanded((state) => !state)}
          className="font-medium text-indigo-500 transition hover:text-indigo-400"
        >
          {isExpanded ? 'Hide details' : 'Quick add tag'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 flex flex-wrap gap-2">
          {['ux', 'visual', 'research', 'frontend', 'analytics', 'strategy'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                const tags = Array.from(new Set([...card.tags, tag]));
                onUpdate(columnId, card.id, { tags });
              }}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              #{tag}
            </button>
          ))}
          {card.tags.length > 0 && (
            <button
              type="button"
              onClick={() => onUpdate(columnId, card.id, { tags: [] })}
              className="rounded-full border border-transparent bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-400"
            >
              Clear tags
            </button>
          )}
        </div>
      )}
    </article>
  );
}

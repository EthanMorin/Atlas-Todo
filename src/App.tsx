import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon, SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { BoardColumn } from './components/BoardColumn.tsx';
import { InlineEditableText } from './components/InlineEditableText.tsx';
import { useBoardStore } from './hooks/useBoardStore.ts';
import { ColumnTheme } from './lib/types.ts';

const themeOptions: { id: ColumnTheme; label: string; swatch: string }[] = [
  { id: 'sky', label: 'Sky', swatch: 'from-sky-400 via-sky-500 to-sky-600' },
  { id: 'violet', label: 'Violet', swatch: 'from-violet-400 via-violet-500 to-violet-600' },
  { id: 'emerald', label: 'Emerald', swatch: 'from-emerald-400 via-emerald-500 to-emerald-600' },
  { id: 'amber', label: 'Amber', swatch: 'from-amber-400 via-amber-500 to-amber-600' },
  { id: 'rose', label: 'Rose', swatch: 'from-rose-400 via-rose-500 to-rose-600' },
  { id: 'slate', label: 'Slate', swatch: 'from-slate-500 via-slate-600 to-slate-700' }
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
    moveCard
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col gap-12 px-6 py-10 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/60 px-8 py-6 shadow-elevated backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-start gap-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 text-white shadow-lg">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <InlineEditableText
                value={boardTitle}
                onSubmit={setBoardTitle}
                className="max-w-xl text-3xl font-semibold text-slate-900 dark:text-white"
                maxLength={54}
              />
              <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Curate your creative sprints, stakeholder rituals, and delivery checkpoints in a tactile, motion-inspired workspace.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/40 px-4 py-3 text-sm font-medium text-slate-500 shadow-inner backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-300 lg:flex">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Live collaboration enabled
            </div>
            <button
              type="button"
              onClick={() => setIsDarkMode((mode) => !mode)}
              className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-elevated dark:bg-white dark:text-slate-900"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
              {isDarkMode ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                Flow roadmap
              </h2>
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                Drag and drop cards between milestones, or tap a card to enrich it with context.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-100 via-slate-100/0 to-transparent dark:from-slate-950" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-100 via-slate-100/0 to-transparent dark:from-slate-950" />
            <div className="scrollbar-thin flex gap-6 overflow-x-auto pb-6 pr-6">
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
                className="flex w-[310px] shrink-0 flex-col gap-4 rounded-3xl border border-dashed border-white/30 bg-white/30 p-6 text-left shadow-inner backdrop-blur dark:border-slate-700 dark:bg-slate-900/40"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  New column
                </p>
                <input
                  value={columnTitle}
                  onChange={(event) => setColumnTitle(event.target.value)}
                  placeholder="Column name"
                  className="w-full rounded-2xl border border-transparent bg-white/90 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-900/60 dark:text-slate-200 dark:focus:ring-indigo-500 dark:focus:ring-offset-slate-950"
                />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Theme
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={clsx(
                          'group relative flex h-16 flex-col items-center justify-center gap-2 rounded-2xl border border-transparent bg-white/60 p-2 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/60 dark:text-slate-300',
                          selectedTheme === theme.id &&
                            'border-indigo-400 text-indigo-500 shadow-lg dark:border-indigo-500 dark:text-indigo-300'
                        )}
                      >
                        <span
                          className={clsx('h-2 w-16 rounded-full bg-gradient-to-r', theme.swatch)}
                        />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-elevated"
                >
                  Create column
                </button>
              </form>
            </div>
          </div>
        </main>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-600 lg:flex-row">
          <p>Crafted for immersive product storytelling.</p>
          <div className="flex items-center gap-4">
            <span>Command palette · ⌘K</span>
            <span>Focus mode · ⇧F</span>
            <span>Share preview · ⌘P</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

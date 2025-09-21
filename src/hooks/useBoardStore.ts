import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Column, Card, ColumnTheme } from '../lib/types';
import { createId } from '../lib/uid';

interface BoardState {
  boardTitle: string;
  columns: Column[];
  availableTags: string[];
  setBoardTitle: (title: string) => void;
  addColumn: (title: string, theme: ColumnTheme) => void;
  updateColumn: (id: string, payload: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  addCard: (columnId: string, card: Pick<Card, 'title' | 'description' | 'tags'>) => void;
  updateCard: (columnId: string, cardId: string, payload: Partial<Card>) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string, position?: number) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

const initialAvailableTags = ['work', 'personal', 'health', 'urgent', 'low-priority', 'shopping'];

const initialColumns: Column[] = [
  {
    id: createId(),
    title: 'To Do',
    theme: 'sky',
    cards: [
      {
        id: createId(),
        title: 'Buy groceries',
        description: 'Milk, bread, eggs, and vegetables for the week.',
        tags: ['personal'],
        createdAt: new Date().toISOString()
      },
      {
        id: createId(),
        title: 'Call dentist',
        description: 'Schedule annual checkup appointment.',
        tags: ['health'],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: createId(),
    title: 'In Progress',
    theme: 'violet',
    cards: [
      {
        id: createId(),
        title: 'Finish project report',
        description: 'Complete the quarterly project summary for the team.',
        tags: ['work'],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: createId(),
    title: 'Done',
    theme: 'emerald',
    cards: []
  }
];

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boardTitle: 'My Todo Board',
      columns: initialColumns,
      availableTags: initialAvailableTags,
      setBoardTitle: (title) => set(() => ({ boardTitle: title })),
      addColumn: (title, theme) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: createId(),
              title,
              theme,
              cards: []
            }
          ]
        })),
      updateColumn: (id, payload) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === id ? { ...column, ...payload } : column
          )
        })),
      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((column) => column.id !== id)
        })),
      addCard: (columnId, card) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === columnId
              ? {
                ...column,
                cards: [
                  ...column.cards,
                  {
                    id: createId(),
                    createdAt: new Date().toISOString(),
                    ...card
                  }
                ]
              }
              : column
          )
        })),
      updateCard: (columnId, cardId, payload) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === columnId
              ? {
                ...column,
                cards: column.cards.map((cardItem) =>
                  cardItem.id === cardId ? { ...cardItem, ...payload } : cardItem
                )
              }
              : column
          )
        })),
      deleteCard: (columnId, cardId) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === columnId
              ? {
                ...column,
                cards: column.cards.filter((cardItem) => cardItem.id !== cardId)
              }
              : column
          )
        })),
      moveCard: (fromColumnId, toColumnId, cardId, position) =>
        set((state) => {
          if (fromColumnId === toColumnId) {
            return {
              columns: state.columns.map((column) => {
                if (column.id !== fromColumnId) return column;

                const currentIndex = column.cards.findIndex((card) => card.id === cardId);
                if (currentIndex === -1) return column;

                const reorderedCards = [...column.cards];
                const [cardToMove] = reorderedCards.splice(currentIndex, 1);

                if (!cardToMove) return column;

                const maxIndex = reorderedCards.length;
                const targetIndexRaw =
                  typeof position === 'number' ? Math.min(Math.max(position, 0), maxIndex) : maxIndex;
                const targetIndex =
                  typeof position === 'number' && position > currentIndex
                    ? targetIndexRaw - 1
                    : targetIndexRaw;

                reorderedCards.splice(targetIndex, 0, cardToMove);

                return { ...column, cards: reorderedCards };
              })
            };
          }

          const fromColumn = state.columns.find((column) => column.id === fromColumnId);
          const cardToMove = fromColumn?.cards.find((card) => card.id === cardId);

          if (!fromColumn || !cardToMove) return state;

          const updatedColumns = state.columns.map((column) => {
            if (column.id === fromColumnId) {
              return {
                ...column,
                cards: column.cards.filter((card) => card.id !== cardId)
              };
            }
            if (column.id === toColumnId) {
              const newCards = [...column.cards];
              const insertionIndex =
                typeof position === 'number'
                  ? Math.min(Math.max(position, 0), newCards.length)
                  : newCards.length;
              newCards.splice(insertionIndex, 0, cardToMove);
              return { ...column, cards: newCards };
            }
            return column;
          });

          return { columns: updatedColumns };
        }),
      addTag: (tag) =>
        set((state) => ({
          availableTags: state.availableTags.includes(tag)
            ? state.availableTags
            : [...state.availableTags, tag]
        })),
      removeTag: (tag) =>
        set((state) => ({
          availableTags: state.availableTags.filter((t) => t !== tag),
          columns: state.columns.map((column) => ({
            ...column,
            cards: column.cards.map((card) => ({
              ...card,
              tags: card.tags.filter((t) => t !== tag)
            }))
          }))
        }))
    }),
    {
      name: 'atlas-flow-board'
    }
  )
);

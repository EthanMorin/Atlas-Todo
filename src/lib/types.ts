export type ColumnTheme = 'sky' | 'amber' | 'violet' | 'emerald' | 'rose' | 'slate';

export interface Card {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  theme: ColumnTheme;
  cards: Card[];
}

# Atlas Flow – Trello-inspired Task Board

Atlas Flow is a modern, Trello-inspired kanban board crafted with React, TypeScript, Zustand, and Tailwind CSS. It was designed as a portfolio-ready showcase with immersive visuals, polished interactions, and delightful UX micro-details.

## Features

- ✨ **Editorial UI** with glassmorphism, gradients, and adaptive dark/light themes.
- 🧠 **Persistent board state** powered by Zustand with local storage, including inline editing for the board title, column titles, and cards.
- ➕ **Create unlimited columns** with bespoke color themes, and add cards complete with descriptions and quick tag suggestions.
- ♻️ **Card utilities** like contextual menus, tag management, column moving, and soft onboarding examples to demonstrate layout dynamics.
- ♿ **Accessible focus states** and keyboard-friendly inline editing experiences.

## Getting Started

```bash
npm install
npm run dev
```

The dev server will be available at [http://localhost:5173](http://localhost:5173).

> **Note:** If npm installation fails in a restricted environment, try again with a registry mirror or use a package manager that is allowed in your network.

## Available Scripts

- `npm run dev` – Start the Vite development server.
- `npm run build` – Type-check and build the project for production.
- `npm run preview` – Preview the production build locally.

## Tech Stack

- React 18 + TypeScript
- Zustand for state management with persistence
- Tailwind CSS for utility-first styling
- Headless UI + Heroicons for accessible menus and iconography
- Vite for fast development builds

## Folder Structure

```
src/
├── App.tsx              # Board layout and column orchestration
├── main.tsx             # React entry point
├── index.css            # Tailwind layers and base styles
├── components/          # Reusable UI components
├── hooks/               # Zustand store for board state
└── lib/                 # Shared types and utilities
```

## Design Notes

- The interface takes inspiration from modern product ops tooling, emphasizing clarity, color contrast, and whitespace.
- Components lean on motion-inspired hover states and frosted glass surfaces to feel tactile and premium.
- Typography combines Plus Jakarta Sans and Inter to strike a contemporary balance between character and readability.

## License

This project is provided for demonstration purposes and can be adapted freely for personal portfolios and case studies.

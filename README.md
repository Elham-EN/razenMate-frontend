# RazenMate - Real-Time Chat App (Frontend)

Welcome to RazenMate, a real-time chat application I developed as a demonstration of my proficiency and passion for software engineering. This project encapsulates a broad spectrum of modern technologies and methodologies, offering a glimpse into my hands-on experience and expertise.

## Motivation

- Deepen my understanding of real-time communication protocols and tools.
- Showcase my skills in frontend and backend integration.
- Experiment with modern design and UI/UX principles.
- Offer a tangible representation of my coding style, architectural decisions, and problem-solving approach to potential employers.

## Features

- Instant Messaging: Empowered by WebSocket with GraphQL subscriptions to ensure fluid real-time communication.
- User Authentication: Secure sign-up and login mechanisms.
- Modern & Responsive UI: Designed with React for a seamless user experience across devices.
- Notifications: Real-time alerts for new messages using Redis for caching and quick retrievals.
- Search Functionality: Efficiently locate past conversations or contacts.

## Tech Stack

# Get started

Clone the repository

```
git@github.com:Elham-EN/razenMate-frontend.git
```

## npm scripts

```
npm cd frontend && npm install
```

## Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier

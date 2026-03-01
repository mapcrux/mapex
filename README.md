# mapex

A React Native (Android-focused) Todo app built with TypeScript.

## Features
- Create, read, update, and delete todos
- Set due dates for todos
- Mark todos as complete
- Persistent storage using SQLite

## Getting Started

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio with Android SDK

### Installation
```bash
npm install
```

## Running the App

### Android
```bash
# Start Metro bundler
npm start

# In a separate terminal, run on Android
npm run android
```

## Running Tests
```bash
npm test
```

## Linting and Formatting
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── screens/        # Screen/page components
├── services/       # Business logic and data access
└── utils/          # Utility functions
```

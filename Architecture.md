
# Amsterdam Bike Map - Project Architecture

## Overview

Amsterdam Bike Map is a React-based web application designed to help users find and navigate bike rental options throughout Amsterdam. The application uses a modern frontend architecture with React, TypeScript, and various supporting libraries to create an interactive bike rental map solution.

## Architecture Layers

### 1. Presentation Layer

- **User Interface (UI)**: Built with React components and styled using Tailwind CSS.
- **Components**: Organized in a modular fashion to ensure reusability and separation of concerns.
- **Pages**: Top-level components that represent different routes in the application.

### 2. Application Layer

- **Hooks**: Custom React hooks to manage state and side effects.
- **Context Providers**: For sharing state across components when necessary.
- **Utilities**: Helper functions for common operations.

### 3. Data Layer

- **API Services**: Functions for interacting with external APIs.
- **Data Models**: TypeScript interfaces defining the structure of the data.
- **Mock Data**: Simulated API responses for development and testing.

## Technical Stack

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React hooks for local state
- **Mapping**: Leaflet.js for interactive maps
- **Routing**: React Router for navigation

### External Services

- **Bike Rental Data**: Integration with various APIs:
  - OV-fiets locations API
  - Amsterdam Bicycle Network API
  - Standard rental shops data

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UI/              # Generic UI components
│   ├── Map/             # Map-related components
│   ├── Filters/         # Search and filter components
│   ├── Nav/             # Navigation components
│   └── ui/              # shadcn/ui component library
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and services
│   ├── api/             # API service modules
│   ├── utils/           # Helper functions
│   └── mockData/        # Mock data for development
├── pages/               # Top-level page components
├── types/               # TypeScript type definitions
└── main.tsx            # Application entry point
```

## Communication Flow

1. **User Interaction**: User interacts with the UI components.
2. **Event Handling**: Components dispatch events based on user actions.
3. **Data Fetching**: React Query orchestrates API calls to fetch data.
4. **State Updates**: Component state is updated with new data.
5. **Rendering**: UI is re-rendered to reflect state changes.

## Key Design Patterns

1. **Component Composition**: Building complex UIs from simpler components.
2. **Custom Hooks**: Extracting and reusing stateful logic between components.
3. **Render Props**: For sharing code between React components using a prop whose value is a function.
4. **Container/Presentational Pattern**: Separating data fetching from presentation.

## Data Flow

```
API Services → React Query → Component State → UI Components
```

The application follows a unidirectional data flow pattern:

1. Data is fetched from APIs using service functions.
2. React Query manages caching, loading states, and refetching.
3. Components consume the data and render accordingly.
4. User interactions trigger state updates or new API requests.

## Future Architecture Considerations

- **Backend Integration**: Replacing mock data with real API endpoints.
- **Authentication**: Adding user authentication and personalization.
- **Offline Support**: Implementing service workers for offline functionality.
- **Performance Optimization**: Code splitting and lazy loading for better performance.

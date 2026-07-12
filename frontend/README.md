# Car Dealership Inventory Frontend

This is the React SPA frontend application for the **Car Dealership Inventory System**. It connects to the Express backend for user authentication and provides an interactive dashboard to list, search, filter, purchase, and manage vehicles.

## Features

- **Attractive Dark Theme**: Custom modern dark styling using Tailwind CSS.
- **Responsive Layout**: Designed for seamless experiences on mobile, tablet, and desktop screens.
- **Authentication Flows**: Real connection to the backend auth server with signup, login, and token guards.
- **Catalog Browse & Filter**: View listings, search by text, filter by category, and filter by price range.
- **Sales Flow Simulation**: Purchase cars with quantity decrements and zero-stock disabling.
- **Admin Control Panel**: Toggle roles on signup to access administrator operations (Add, Edit, Delete, Restock).

## Prerequisites

- Node.js (v18+)
- Local MongoDB database (to run backend)

## Setup and Running

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:5173`.

3. **Run Unit Tests**:
   ```bash
   npm test
   ```

## My AI Usage

### AI Tools Used
- **Antigravity**: Utilized as the primary pair-programming AI coding assistant to design configuration structures, write component code, style the layout using Tailwind CSS utility tokens, and develop testing strategies.
- **Gemini Image Generation**: Used to generate the premium showroom hypercar hero asset for the landing page (`hero.png`).

### Workflow Details
- **Boilerplate & Configs Generation**: The assistant generated the initial configuration files (`babel.config.cjs`, `jest.config.cjs`, `jest.setup.js`, and postcss/tailwind structures) to guarantee a robust testing environment for React 19.
- **Component Structuring**: Asked the assistant to design a unified auth routing flow (Landing -> Auth -> Dashboard) and mock the inventory endpoint behaviors in localStorage so the application remains functional even without backend vehicle APIs.
- **Test Suite Construction**: Utilized the assistant to build automated mock-assisted tests for `Login.jsx` and `Register.jsx` using Jest and React Testing Library.

### Reflection
Integrating AI into the development loop substantially expedited the setup of complex configurations like Babel and Jest for React 19. By automating repetitive tasks, we could focus entirely on details like validation logic, dashboard roles, and professional visual aesthetics.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JHipster 9.0.0-beta.0 generated React + TypeScript application with Redux Toolkit state management and Tailwind CSS v4.1.18 for styling. The application is an Egyptian antiquities management system with multiple page modules for managing monuments, eras, dynasties, galleries, and users.

## Essential Commands

### Development

```bash
npm install              # Install dependencies
npm start                # Start webpack dev server (frontend only)
npm run watch           # Run both frontend and backend concurrently
```

Note: The README mentions `npm backend:start`, but this script is not defined in package.json. Use `npm run watch` for full-stack development.

### Build & Production

```bash
npm run build           # Production build (runs webapp:prod)
npm run webapp:build    # Development build
npm run build-watch     # Watch mode for development build
```

### Testing

```bash
npm test                # Run Jest unit tests (includes pretest lint)
npm run test:watch      # Run tests in watch mode
npm run jest:update     # Update Jest snapshots
npm run e2e             # Run Cypress E2E tests (headed mode)
npm run e2e:headless    # Run Cypress E2E tests (headless)
npm run cypress         # Open Cypress interactive runner
```

### Code Quality

```bash
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run prettier:check  # Check code formatting
npm run prettier:format # Auto-format code
```

### Run Single Test

```bash
npm test -- path/to/test.spec.ts           # Run specific test file
npm test -- --testNamePattern="test name"  # Run tests matching pattern
```

## Architecture

### State Management Architecture

The application uses Redux Toolkit (@reduxjs/toolkit) with a modular reducer structure:

- Store configuration: `src/main/webapp/app/config/store.ts`
- Root reducers combined in: `src/main/webapp/app/shared/reducers/index.ts`
- Core reducers: `authentication`, `locale`, `loadingBar`, and page-specific reducers (e.g., `Eras`)
- Custom middleware stack includes: error handling, notifications, loading bar, and logger
- Typed hooks `useAppSelector` and `useAppDispatch` for type-safe Redux access

### Application Bootstrap Flow

1. Entry point: `src/main/webapp/app/index.tsx` creates root, sets up store and axios interceptors
2. Main App: `src/main/webapp/app/app.tsx` handles locale management, text direction, and routing
3. Axios interceptors automatically attach JWT tokens from session storage (key: `token`)
4. Session fetched on login via Redux actions

### Routing Architecture

- React Router v7 with lazy loading via `react-loadable`
- Routes defined in: `src/main/webapp/app/routes.tsx`
- `ErrorBoundaryRoutes` wrapper provides error boundary protection
- `PrivateRoute` component available for authentication-based route protection
- Login page is the index route; authenticated routes are wrapped in `LayoutSystemTemplete`
- Active page routes: dashboard, eras, descriptionMonuments, dynasty, favourites, gallery, monuments, monumentsEra, monumentsType, portalUsers, savedSearch, userHistory, users
- Account and admin routes are commented out

### Authentication Flow

- Login endpoint: `http://localhost:3000/api/v1/auth/login`
- Authentication state managed via Redux (`authentication` reducer)
- JWT token stored in session storage with key `token`
- Token automatically attached to requests via axios interceptor
- 401 responses trigger authentication clearing
- User roles are checked from response: `response.data.data.user.roles`

### i18n Architecture

- Supports English (en) and Arabic (ar) locales
- Translation files in: `src/main/webapp/i18n/{locale}/*.json`
- Build process merges JSON files per locale using `merge-jsons-webpack-plugin`
- Locale state managed via Redux (`locale` reducer)
- Text direction automatically set based on current locale (RTL for Arabic)
- Translation registration happens at app initialization in `index.tsx`

### Styling System

- **Tailwind CSS v4.1.18** is the primary styling framework
- Tailwind imported via `@use "tailwindcss"` in `app.scss`
- PostCSS configuration includes Tailwind, RTL CSS support via `postcss-rtlcss`, and autoprefixer
- Additional UI libraries: PrimeReact (with Lara Light Blue theme), Lucide React icons
- Custom CSS files: fonts.css, design-system.css, theme.css, kemetra.css (including RTL variant)
- SCSS still supported for component-specific styles

### TypeScript Configuration

- Base config: `tsconfig.json` with path alias `app/*` → `src/main/webapp/app/*`
- Test config: `tsconfig.test.json` for Jest
- Cypress config: `src/test/javascript/cypress/tsconfig.json`
- Target: ES6 with ESNext modules, JSX: React
- Output: `target/classes/static/app`

### Webpack Build System

- Common config: `webpack/webpack.common.js` (shared settings, plugins, loaders)
- Dev config: `webpack/webpack.dev.js` (hot reload, source maps, dev server)
- Prod config: `webpack/webpack.prod.js` (minification, optimization)
- Uses thread-loader for parallel TypeScript compilation
- Filesystem caching enabled for faster rebuilds in `target/webpack`
- Path aliases automatically mapped from tsconfig

## Key Files & Patterns

### Configuration Files

- `webpack/environment.js` - Environment variables and build constants
- `src/main/webapp/app/config/constants.ts` - Application constants including AUTHORITIES, API endpoints, date formats
- `src/main/webapp/app/config/axios-interceptor.ts` - HTTP interceptor setup
- `src/main/webapp/app/config/translation.ts` - i18n configuration and text direction
- `src/main/webapp/app/config/dayjs.ts` - Day.js configuration
- `postcss.config.cjs` - PostCSS plugins (RTL CSS, autoprefixer, Tailwind)

### API Configuration

- Base URL: `http://localhost:3000/api` (defined in `constants.ts`)
- Axios timeout: 60 seconds
- Authentication header: `Authorization: Bearer <token>`
- Example endpoints defined in constants: `/v1/auth/login`, `/v1/auth/logout`, `/v1/eras`

### Middleware Pattern

Redux middleware stack in store configuration handles cross-cutting concerns:

- `error-middleware.ts` - Global error handling
- `notification-middleware.ts` - Toast notifications via react-toastify
- `logger-middleware.ts` - Development logging
- Position: `top-left` for ToastContainer

### Private Route Pattern

Authentication is checked via `hasAnyAuthority()` helper function which verifies user authorities against required roles (ADMIN, USER). The function is available in `src/main/webapp/app/shared/auth/private-route.tsx` but currently authentication routes are commented out in the main routes file.

### Page Module Pattern

Page modules follow a consistent structure in `src/main/webapp/app/modules/pages/{page-name}/`:

- Component file (e.g., `eras.tsx`)
- Reducer file with async thunks (e.g., `eras.reducer.ts`)
- Reducers registered in `src/main/webapp/app/shared/reducers/index.ts`

### Testing Structure

- Unit tests co-located with components: `*.spec.ts(x)` files
- E2E tests: `src/test/javascript/cypress/e2e/`
- Cypress support files and custom commands: `src/test/javascript/cypress/support/`
- Jest config uses path alias mapping from tsconfig
- Test setup file: `src/main/webapp/app/setup-tests.ts`
- Test environment: `jest-fixed-jsdom`

## Important Notes

- **Tailwind v4**: Use Tailwind utility classes for new components. RTL support is automatic via PostCSS.
- **JHipster Conventions**: This is a JHipster-generated app; follow JHipster patterns for consistency.
- **Path Aliases**: Use `app/*` imports instead of relative paths (e.g., `import { foo } from 'app/shared/util'`).
- **No Backend Scripts**: The `backend:start` command mentioned in README is not defined in package.json.
- **Code Quality**: Husky and lint-staged are configured. Linting runs before tests via `pretest` script.
- **Bundle Size**: Uses code splitting with lazy loading for better performance.
- **PWA Support**: Service worker code is commented out by default in `index.html`.
- **Node Version**: Requires Node.js >= 24.11.1 (specified in package.json engines).

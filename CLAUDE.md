# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JHipster 9.0.0-beta.0 generated React + TypeScript application with Redux Toolkit state management. The project has been recently updated to use Tailwind CSS v4.1.18 for styling, replacing the previous styling approach.

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
- Core reducers: `authentication`, `locale`, `applicationProfile`, and `loadingBar`
- Custom middleware stack includes: error handling, notifications, loading bar, and logger
- Typed hooks `useAppSelector` and `useAppDispatch` for type-safe Redux access

### Application Bootstrap Flow

1. Entry point: `src/main/webapp/app/index.tsx` creates root, sets up store and axios interceptors
2. Main App: `src/main/webapp/app/app.tsx` handles session initialization, locale management, and routing
3. Axios interceptors automatically attach JWT tokens from local/session storage
4. Session and profile fetched on app mount via Redux actions

### Routing Architecture

- React Router v7 with lazy loading via `react-loadable`
- Routes defined in: `src/main/webapp/app/routes.tsx`
- `ErrorBoundaryRoutes` wrapper provides error boundary protection
- `PrivateRoute` component handles authentication-based route protection
- Currently only home route is active; account and admin routes are commented out

### i18n Architecture

- Supports English (en) and Arabic (ar) locales
- Translation files in: `src/main/webapp/i18n/{locale}/*.json`
- Build process merges JSON files per locale using `merge-jsons-webpack-plugin`
- Locale state managed via Redux (`locale` reducer)
- Text direction automatically set based on current locale (RTL for Arabic)
- Translation registration happens at app initialization in `index.tsx`

### Styling System

- **Tailwind CSS v4.1.18** is the primary styling framework (recently migrated from v3)
- Tailwind imported via `@use "tailwindcss"` in `app.scss`
- PostCSS configuration includes Tailwind, RTL CSS support, and autoprefixer
- SCSS still supported for component-specific styles
- Some legacy SCSS files remain (header, footer, home modules)

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
- Filesystem caching enabled for faster rebuilds
- Path aliases automatically mapped from tsconfig

## Key Files & Patterns

### Configuration Files

- `webpack/environment.js` - Environment variables and build constants
- `src/main/webapp/app/config/constants.ts` - Application constants including AUTHORITIES
- `src/main/webapp/app/config/axios-interceptor.ts` - HTTP interceptor setup
- `src/main/webapp/app/config/translation.ts` - i18n configuration and text direction
- `src/main/webapp/app/config/dayjs.ts` - Day.js configuration

### Middleware Pattern

Redux middleware stack in store configuration handles cross-cutting concerns:

- `error-middleware.ts` - Global error handling
- `notification-middleware.ts` - Toast notifications via react-toastify
- `logger-middleware.ts` - Development logging
- Position: `top-left` for ToastContainer

### Private Route Pattern

Authentication is checked via `hasAnyAuthority()` helper function which verifies user authorities against required roles (ADMIN, USER). Currently, authentication routes are commented out in the main routes file.

### Testing Structure

- Unit tests co-located with components: `*.spec.ts(x)` files
- E2E tests: `src/test/javascript/cypress/e2e/`
- Cypress support files and custom commands: `src/test/javascript/cypress/support/`
- Jest config uses path alias mapping from tsconfig
- Test setup file: `src/main/webapp/app/setup-tests.ts`

## Important Notes

- **Tailwind v4**: Recently migrated to Tailwind CSS v4. Use Tailwind utility classes for new components.
- **JHipster Conventions**: This is a JHipster-generated app; follow JHipster patterns for consistency.
- **Path Aliases**: Use `app/*` imports instead of relative paths (e.g., `import { foo } from 'app/shared/util'`).
- **No Backend Scripts**: The `backend:start` command mentioned in README is not defined in package.json.
- **Code Quality**: Husky git hooks are configured. Linting runs before tests via `pretest` script.
- **Bundle Size**: Uses code splitting with lazy loading for better performance.
- **PWA Support**: Service worker code is commented out by default in `index.html`.

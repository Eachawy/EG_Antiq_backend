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
- Active page routes: dashboard, eras, descriptionMonuments, dynasty, favourites, gallery, monuments, monumentsEra, monumentsType, portalUsers, savedSearch, userHistory, users, roles, userRoles, sources, books, monumentSources, monumentBooks
- Some routes (users, portalUsers, roles, userRoles, favourites, savedSearch, userHistory) are protected with `PrivateRoute` requiring `PORTAL_ADMIN` authority
- Account and admin routes are commented out

### Authentication Flow

- **Login endpoint**: `http://localhost:3000/api/v1/auth/login`
- **Logout endpoint**: `http://localhost:3000/api/v1/auth/logout`
- **Refresh endpoint**: `http://localhost:3000/api/v1/auth/refresh`
- Authentication state managed via Redux (`authentication` reducer in `src/main/webapp/app/shared/reducers/authentication.ts`)
- **Tokens**: Both access token and refresh token stored in session/local storage
  - Access token key: `token` (from `AUTH_TOKEN_KEY` constant)
  - Refresh token key: `refreshToken` (from `REFRESH_TOKEN_KEY` constant)
- **Token refresh flow**:
  - On 401 responses, axios interceptor automatically attempts to refresh the access token
  - Uses refresh token to get new access token via `/v1/auth/refresh` endpoint
  - Queues failed requests and retries them with new token
  - If refresh fails, clears all tokens and redirects to login
- Token automatically attached to all requests via axios interceptor (`Authorization: Bearer <token>`)
- User roles are checked from login response: `response.data.data.user.roles`
- **Authorities**: Three roles defined in constants - `ADMIN: "admin"`, `USER: "member"`, `PORTAL_ADMIN: "PORTAL_ADMIN"`

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

**Typical reducer pattern**:

- Uses `createAsyncThunk` for async API calls
- Network requests use helper functions from `app/config/network-server-reducer`:
  - `getVerifiedRequest(url)` for GET
  - `postVerifiedRequest(url, data)` for POST
  - `putVerifiedRequest(url, data)` for PUT
  - `deleteVerifiedRequest(url, data)` for DELETE
- Standard actions: get list, create, update, delete
- Uses `isPending` and `isRejected` matchers for loading/error states
- Example API endpoints follow pattern: `/v1/{resource}` with `/:id` suffix for specific items

### Testing Structure

- Unit tests co-located with components: `*.spec.ts(x)` files
- E2E tests: `src/test/javascript/cypress/e2e/`
- Cypress support files and custom commands: `src/test/javascript/cypress/support/`
- Jest config uses path alias mapping from tsconfig
- Test setup file: `src/main/webapp/app/setup-tests.ts`
- Test environment: `jest-fixed-jsdom`

## Docker Deployment

### Container Architecture

The admin frontend runs in a Docker container with the following architecture:

**Dockerfile**: Multi-stage build
- **Stage 1 (Builder)**: Node.js 24.11.1 Alpine
  - Accepts `BACKEND_URL` build argument
  - Runs `npm run build` to compile React app
  - Output: `target/classes/static/`

- **Stage 2 (Production)**: Nginx 1.27 Alpine
  - Installs bash and curl for health checks
  - Creates non-root user `appuser` (UID/GID 1001)
  - Copies built static files to `/usr/share/nginx/html`
  - **Exposes port 8080** (not 80!)
  - Health check: `http://localhost:8080/health`

**Important Port Configuration**:
- **Internal port**: 8080 (Nginx listens here)
- **Production mapping**: `127.0.0.1:3001:8080` (host 3001 → container 8080)
- **Note**: Container does NOT run on port 80 or 3001 internally!

**nginx.conf Configuration**:
- Listens on port 8080
- Serves static files from `/usr/share/nginx/html`
- SPA routing support (try_files fallback to index.html)
- Health check endpoint at `/health`
- Gzip compression enabled
- **API Proxy**: ~~Previously proxied `/api/*` to backend~~ **REMOVED** (unified gateway handles this)

**docker-entrypoint.sh**:
- Replaces `BACKEND_URL_PLACEHOLDER` in nginx.conf with actual `BACKEND_URL` from environment
- Defaults to `http://localhost:3000` if not provided

### Production Deployment (Unified Gateway Architecture)

**⚠️ IMPORTANT**: This frontend is deployed as part of a unified architecture with centralized NGINX gateway.

**Architecture Overview**:
```
Internet (Port 80/443)
         │
         ▼
  Unified NGINX Gateway (EG_Antiq repository)
         │
         ├─ api.kemetra.org → API Backend (port 3000)
         ├─ admin.kemetra.org → Admin Frontend (port 8080)
         └─ kemetra.org → Portal Frontend (port 3000)
```

**Production Deployment**:

The admin frontend is **NOT deployed standalone**. It's deployed via the main API repository (`EG_Antiq`) which contains:
- `docker-compose.production.yml` - Orchestrates all services
- `nginx-configs/unified-kemetra.conf` - Main gateway configuration

**From EG_Antiq repository**:
```bash
# Deploy all services (API + Admin + Portal + Gateway)
cd /root/EG_Antiq
docker compose -f docker-compose.production.yml up -d --build
```

**Frontend-specific service configuration** (in EG_Antiq's docker-compose.production.yml):
```yaml
admin-frontend:
  build:
    context: ../EG_Antiq_backend  # This repository
    dockerfile: Dockerfile
    args:
      BACKEND_URL: https://api.kemetra.org
  container_name: production-admin
  environment:
    NODE_ENV: production
    BACKEND_URL: https://api.kemetra.org
  ports:
    - '127.0.0.1:3001:8080'  # Localhost only, gateway proxies
  networks:
    - production-network
  restart: always
```

**Key Points**:
- ✅ Unified gateway handles SSL termination, CORS, rate limiting, routing
- ✅ Admin frontend only serves static files (no internal API proxy)
- ✅ All API calls go through unified gateway at `https://api.kemetra.org`
- ✅ Frontend accessible via `https://admin.kemetra.org`
- ✅ Container binds to localhost only for security

**DNS Configuration**:
| Subdomain | Points To | Purpose |
|-----------|-----------|---------|
| admin.kemetra.org | 153.92.209.167 | Admin Frontend |
| api.kemetra.org | 153.92.209.167 | Backend API |
| kemetra.org | 153.92.209.167 | Portal Frontend |

**Deprecated Scripts**:
- ~~`scripts/setup-domain.sh`~~ - **DEPRECATED**: Use unified gateway instead
- ~~`scripts/setup-ssl.sh`~~ - **DEPRECATED**: SSL handled by unified gateway
- ~~`deploy-production.sh`~~ - **DEPRECATED**: Deploy via EG_Antiq repository

**Environment Variables**:
- `BACKEND_URL`: Full API URL (e.g., `https://api.kemetra.org`)
  - **Build-time**: Baked into React app via webpack
  - **Runtime**: Used by nginx.conf entrypoint script
- `NODE_ENV`: `production`

**Local Development Docker** (Standalone - For Testing Only):
```bash
# Local test build (not for production)
docker build --build-arg BACKEND_URL=http://localhost:3000 -t admin-test .
docker run -p 3001:8080 admin-test

# Access at: http://localhost:3001
```

### Troubleshooting

**Container won't start**:
```bash
# Check logs
docker logs production-admin

# Check if port 3001 is in use
lsof -i :3001

# Restart container
docker restart production-admin
```

**Frontend shows blank page**:
- Check if static files were copied correctly in Docker build
- Verify BACKEND_URL is correct in build args
- Check browser console for errors

**API calls failing**:
- ✅ Verify unified gateway is running: `docker ps | grep nginx`
- ✅ Check CORS configuration in API `.env.production`
- ✅ Test API directly: `curl https://api.kemetra.org/api/v1/health`
- ❌ Do NOT check internal nginx proxy (it's been removed)

## Important Notes

- **Tailwind v4**: Use Tailwind utility classes for new components. RTL support is automatic via PostCSS.
- **JHipster Conventions**: This is a JHipster-generated app; follow JHipster patterns for consistency.
- **Path Aliases**: Use `app/*` imports instead of relative paths (e.g., `import { foo } from 'app/shared/util'`).
- **No Backend Scripts**: The `backend:start` command mentioned in README is not defined in package.json.
- **Code Quality**: Husky and lint-staged are configured. Linting runs before tests via `pretest` script.
- **Bundle Size**: Uses code splitting with lazy loading for better performance.
- **PWA Support**: Service worker code is commented out by default in `index.html`.
- **Node Version**: Requires Node.js >= 24.11.1 (specified in package.json engines).
- **Backend Dependency**: Frontend requires backend API to be accessible. Configure `BACKEND_URL` in environment files.

# Project Instructions

## 1. Project Overview
A full-stack web app for managing events within organizations. Users log in with a private token and can view and manage their organization’s events. Each event has a name, 	description, capacity, and start and end times.
## 2. Technology Stack
Frontend (client/)
* React 18: UI library.
* Create React App (react-scripts 5): build and dev server tooling.
* React Router 6: client-side routing.
* Apollo Client 3: GraphQL queries and mutations, plus response caching.
* CSS Modules: component-scoped styling.
* Moment.js: date and time formatting.
* Testing libraries: React Testing Library, Jest DOM and user-event are installed, but no tests are written.
Backend (server/)
* Node.js 22: runtime.
* TypeScript: compiled to dist/ with CommonJS output, using decorators.
* Apollo Server 4: standalone GraphQL server on port 4000.
* GraphQL 16: API layer, with a schema and resolvers.
* nodemon: runs the compiled dist/app.js.
Database
* PostgreSQL 16: relational database named EventOrganizee, running on port 5432.
* TypeORM 0.3: ORM with entity decorators.
* synchronize: true: tables are created and updated automatically from the entities.
* pg: the Postgres driver.
* Reflect-metadata: needed for the TypeORM decorators.
Authentication
* Private token: sent in a request header and checked against the users table.
* No passwords or roles.

## 3. Project Structure
- client: it uses for frontend 
- server: it uses for backend

## 4. Coding Standards
- Use TypeScript.
- Avoid using `any` unless absolutely necessary.
- Follow existing naming conventions.
- Write reusable functions.
- Use async/await for asynchronous operations.

## 5. Database Guidelines
- Use TypeORM for database operations.
- Use existing entities and repositories.
- Never modify database schemas without an approved migration.

## 6. GraphQL Guidelines
- Keep resolvers focused on request handling.
- Put business logic in service classes.
- Follow existing GraphQL naming conventions.

## 7. Security Guidelines
- Never hardcode credentials or secrets.
- Never bypass authentication or authorization.
- Do not expose sensitive information in API responses.

## 9. Important Restrictions
- Do not introduce new libraries without approval.
- Do not change existing API contracts without approval.
- Do not modify environment files.
- Do not commit or push code unless explicitly requested.

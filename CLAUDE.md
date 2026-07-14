# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with nodemon + ts-node (watches index.ts)
npm run build      # Compile TypeScript to dist/
npm start          # Run compiled output from dist/index.js
npm run codegen    # Regenerate GraphQL types (requires server running on localhost:8080/graphql)
```

## Architecture

This is a **GraphQL API** for visitor management and workplace access control. Stack: Express + Apollo Server, MongoDB (Mongoose), TypeScript.

### Request flow

```
HTTP Request
  → Express middleware (CORS, body parsing)
  → authMiddleware (JWT → ctx.user)
  → Apollo Server /graphql
  → schema.ts (root Query/Mutation composed from 12 gateway modules)
  → isAUthenticated / isAdminOrManager wrapper (src/middleware/isAuthenticated.ts)
  → resolver function
  → Mongoose model
```

REST endpoints in `index.ts` handle: image upload signing, visitor approval/rejection links, and integration webhooks (Teams, Slack, Google Chat).

### Gateway modules (`src/gateway/`)

Each module follows the same structure:
- `schema.ts` — defines Query/Mutation fields and wires resolver functions
- `types/` — GraphQL `InputObjectType` and `ObjectType` definitions (no SDL files; pure graphql-js)
- `resolver/` — async functions containing business logic

The 12 modules are: `user`, `visitor`, `category`, `company`, `locations`, `employee`, `device`, `department`, `deliveries`, `integrations`, `preRegisterVisitor`, `spaces`.

All are composed in the root `schema.ts`.

### Resolver conventions

```typescript
export default async (args, ctx) => {
  try {
    // business logic
    return result;
  } catch (error: any) {
    return { error: { message: error.message || "Something went wrong", code: "INTERNAL_SERVER_ERROR" } };
  }
};
```

- Read-only queries use `.lean()` on Mongoose queries for performance.
- Mutations wrapped with `isAdminOrManager(args, ctx, resolver)` or `isAUthenticated(args, ctx, resolver)` in the schema — the resolver itself only receives `(args, ctx)`, not `(_, args, ctx)`.
- Payload types follow the pattern `{ data?, error?: { message, code }, token? }`.

### Adding a new field to a model

Touch 4 files in order:
1. `database/models/<model>.ts` — add to Mongoose schema (and TypeScript interface if present)
2. `src/gateway/<module>/types/<Type>.ts` — add to `GraphQLObjectType` for reads
3. `src/gateway/<module>/types/<Input>.ts` — add to `GraphQLInputObjectType` for writes
4. `src/gateway/<module>/resolver/<resolver>.ts` — use the new field in queries/mutations

### Authentication

- JWT is parsed in `src/middleware/authMiddleware.ts` and attached to Apollo context as `ctx.user`.
- `ctx.user.company` is the MongoDB ObjectId used to scope almost all queries.
- `ctx.user.role` is `admin | manager | employee`.

### Code generation

`src/generated/graphql.ts` contains auto-generated TypeScript arg types (e.g. `MutationUpdateCompanyArgs`, `QueryGetUsersArgs`). Run `npm run codegen` after schema changes to keep these in sync. The codegen script requires the dev server to be running.

### Key environment variables

| Variable | Purpose |
|---|---|
| `DB_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` / `JWT_EXPIRY` | Token signing |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |
| `DEBUG` | Enables GraphQL introspection/playground |
| `FRONTEND_URL` | Used in approval/rejection email links |
| `DO_SPACES_KEY/SECRET` | DigitalOcean Spaces (S3-compatible) for image uploads |
| `TWILIO_*` | SMS notifications |
| `SLACK_*` / `MS_*` | OAuth for Slack and Microsoft Teams integrations |

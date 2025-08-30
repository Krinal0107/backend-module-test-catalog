# Book Catalog Backend (MongoDB, TypeScript, Express)

Implements the requirements from the SRD & Postman collection:
- Auth (`/api/users/register`, `/api/users/login`) with JWT
- Books CRUD (`/api/books`, `/api/books/:id`) with ownership & admin checks
- Validation with express-validator
- Pagination, search, filter & sort on list endpoint
- Hardened middleware (helmet, cors, rate limit, pino-http)
- Swagger docs at `/docs`
- Consistent JSON response envelope

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
# visit http://localhost:5000/healthz and http://localhost:5000/docs
```

### Docker (MongoDB only)
```bash
docker run -d --name mongo-book -p 27017:27017 mongo:7
# .env -> MONGODB_URI=mongodb://localhost:27017/bookcatalog
```

## Endpoints

- POST `/api/users/register`
- POST `/api/users/login`
- GET  `/api/books` (query: q, author, category, yearFrom, yearTo, sort, page, limit)
- GET  `/api/books/:id`
- POST `/api/books` (auth)
- PUT  `/api/books/:id` (auth, owner or admin)
- DELETE `/api/books/:id` (auth, owner or admin)

### Response envelope

Success:
```json
{ "ok": true, "data": { ... }, "meta": { ... } }
```

Validation error:
```json
{ "ok": false, "errors": [ { "path":"title", "msg":"Required" } ] }
```

## Scripts
- `npm run dev` – start with ts-node-dev
- `npm run build` – compile to `dist/`
- `npm start` – run built code

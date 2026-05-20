# Vitalia Frontend

Next.js client for **Vitalia**, an EMR & appointment management platform with role-based views for patients, providers, and admins.

**Backend repo →** [vitalia-backend](https://github.com/RuiQiHuang1832/vitalia-backend)

## Screenshots

### Provider — Dashboard

![Provider dashboard](https://github.com/user-attachments/assets/06738611-a605-41da-a928-b084d9c43e6f)

### Provider — Appointments

![Provider appointments](https://github.com/user-attachments/assets/39045e88-3ab7-4b88-b60b-a0d98172cead)

### Provider — Messaging

![Provider messaging](https://github.com/user-attachments/assets/aa1e2e96-f1e4-4616-9a42-50006db1a9ff)

### Patient — Portal

![Patient portal](https://github.com/user-attachments/assets/36883f93-4266-4234-8e67-461144ac4040)

## Features

- **Authentication** — JWT in HttpOnly cookies, role-gated routes via middleware
- **Provider** — patient list, EMR editor (notes, vitals, medications, allergies), appointment scheduling, provider management
- **Patient** — profile, upcoming appointments, EMR summary
- **Admin** — user and provider management
- **Messaging** — real-time provider ↔ patient chat with typing indicators, read receipts, and search (socket.io)

## Tech Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Zustand · SWR · React Hook Form + Zod · socket.io-client · Vitest · Playwright

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000` and proxies `/api/*` to the backend at `http://localhost:8080`. Start the [backend](https://github.com/RuiQiHuang1832/vitalia-backend) first.

## Scripts

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm run dev`      | Dev server (Turbopack)            |
| `npm run build`    | Production build                  |
| `npm run start`    | Run production server             |
| `npm run lint`     | ESLint                            |
| `npm run test`     | Vitest (watch)                    |
| `npm run test:run` | Vitest (single run)               |
| `npx playwright test` | Playwright E2E                 |

# Ledgerly

A full-stack, open-source invoicing and billing management dashboard for tracking revenue, managing clients, and monitoring payment statuses.

## Features

- **Invoice Management** — Track Paid, Pending, Overdue, and Draft invoices with status badges
- **User Authentication** — Register and sign in with email/password (NextAuth + JWT)
- **Persistent Storage** — All invoices saved to a local SQLite database via Prisma
- **Create Invoices** — Modal form with client, amount, currency, due date, description
- **Filter & Search** — Filter by status (All/Paid/Pending/Overdue/Draft) and search by client or invoice number
- **Dashboard KPIs** — Revenue this month, outstanding balance, overdue amount, active client count
- **Revenue Chart** — SVG area chart with 6-month trend
- **Demo Mode** — Pre-seeded with sample data to explore immediately
- **Responsive UI** — Works on desktop, tablet, and mobile
- **MIT Licensed** — Free to use, modify, and distribute

## Tech Stack

- **Framework:** Next.js 16 (React 19) — App Router
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Authentication:** NextAuth (Credentials provider, JWT sessions)
- **Styling:** CSS custom properties
- **Icons:** Inline SVG

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Initialize the database (creates dev.db + seeds demo data)
npm run db:push
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Credentials

After running `npm run db:seed`, log in with:

```
Email:    demo@ledgerly.io
Password: demo1234
```

Or register a new account directly from the login page.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (GUI database browser) |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/register` | Create a new user account |
| GET | `/api/invoices` | List all invoices for the current user |
| POST | `/api/invoices` | Create a new draft invoice |
| PATCH | `/api/invoices/[id]` | Update an invoice (e.g. mark paid) |
| DELETE | `/api/invoices/[id]` | Delete an invoice |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   NextAuth route handler
│   │   ├── invoices/             Invoices CRUD API
│   │   └── register/             User registration API
│   ├── login/                    Login / register page
│   ├── globals.css               Global styles
│   ├── layout.tsx                Root layout with SessionProvider
│   └── page.tsx                  Invoicing dashboard
├── components/
│   └── SessionProvider.tsx        Auth session context wrapper
├── lib/
│   ├── auth.ts                   NextAuth configuration
│   └── prisma.ts                 Prisma client singleton
└── proxy.ts                      Route protection (auth redirect)
```

## License

MIT — see [LICENSE](LICENSE). Free for personal and commercial use.

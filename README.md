# SarathiEdTech

SarathiEdTech is a lightweight, high-performance job opportunity aggregation platform. It enables administrators to post legitimate job opportunities with original job descriptions and application URLs, while allowing job seekers to browse, search, filter, and apply directly via external official portals.

---

## 🎯 Project Purpose & Scope

SarathiEdTech connects job seekers directly with legitimate job openings.

### Scope (V1)
- **Public Jobs / Home Page**: Browse active job listings.
- **Individual Job Details Page**: Detailed job description, metadata, and requirements.
- **About Page**: Mission and platform details.
- **Admin Authentication & Dashboard**: Secure login for site management.
- **Job Management (CRUD)**: Create, edit, delete, publish, and unpublish job listings.
- **External Redirect ("Apply Now")**: Direct candidates to official application portals.
- **Click & View Tracking**: Track job impressions and application click-through rates.
- **Search & Filtering**: Quick keyword search and basic category/location filtering.
- **SEO-Friendly Architecture**: Clean URLs and server-rendered meta tags.

### Explicit Non-Goals (V1 Out of Scope)
- Candidate/Employer user accounts or dashboards
- Resume uploads or automatic job applications
- Payment gateways or paid listings
- Complex recommendation engines or chatbots

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: Server-side validation

---

## 📁 Initial Folder Structure

```
SarathiEdTechWebsite/
├── prisma/
│   └── schema.prisma         # Database schema & Prisma config
├── src/
│   ├── app/                  # App Router pages & API routes
│   │   ├── (public)/         # Public user routes (Home, Jobs, About)
│   │   ├── admin/            # Admin authentication & management routes
│   │   └── api/              # API endpoints (tracking, redirects)
│   ├── components/           # UI & Feature components
│   │   ├── ui/               # Reusable primitive components (Button, Input, Card)
│   │   ├── layout/           # Shared layouts (Header, Footer, Navbar)
│   │   ├── jobs/             # Job list, search, filter, and detail components
│   │   └── admin/            # Admin dashboard components and forms
│   ├── lib/                  # Utilities, Prisma singleton, helper modules
│   └── types/                # Shared TypeScript type definitions
├── .env.example              # Template for environment variables
├── README.md                 # Project documentation
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/sarathiedtech_db` |
| `NEXT_PUBLIC_APP_URL` | Public application URL | `http://localhost:3000` |
| `ADMIN_EMAIL` | Admin login credential | `admin@sarathiedtech.com` |
| `ADMIN_PASSWORD` | Admin login password | `change_this_in_production` |
| `JWT_SECRET` | Secret key for JWT admin tokens | `min-32-characters-long-secret-key` |

---

## 🗄️ Database Setup

1. Ensure a PostgreSQL instance is running locally or accessible remotely.
2. Update `DATABASE_URL` in `.env` with your database credentials.
3. Run database migrations to set up the schema:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

---

## 💻 Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npx tsc --noEmit` | Runs TypeScript type checking |
| `npx prisma studio` | Opens Prisma Studio to view database records |

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Push database schema
npx prisma db push

# 4. Run development server
npm run dev
```

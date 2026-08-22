# Dayflow — Human Resource Management System

A production-quality HRMS built with modern web technologies.

## Architecture

```
React (Frontend) → Express (Backend) → Prisma (ORM) → PostgreSQL (Database)
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod
- Recharts
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validation)
- dotenv
- CORS

### Development
- Docker & Docker Compose
- npm workspaces
- tsx (TypeScript execution)

## Requirements

- Node.js >= 18
- npm >= 9
- Docker
- Docker Compose

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd dayflow

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

## Environment Setup

### Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env if needed (defaults work for local development)
cd ..
```

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env if needed (defaults work for local development)
cd ..
```

## Database Setup

```bash
# Start PostgreSQL container
npm run db:up

# Wait for PostgreSQL to be healthy, then run:

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

## Development Commands

```bash
# Start all services (frontend + backend)
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Database management
npm run db:up          # Start PostgreSQL
npm run db:down        # Stop PostgreSQL
npm run db:logs        # View PostgreSQL logs
npm run db:restart     # Restart PostgreSQL
npm run db:reset       # Reset database (destroys data)

# Prisma commands
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## Ports

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:5173         |
| Backend    | http://localhost:5000         |
| Health     | http://localhost:5000/api/health |
| PostgreSQL | localhost:5433               |

## Database Credentials (Local Development Only)

| Parameter | Value    |
|-----------|----------|
| Database  | dayflow  |
| User      | dayflow  |
| Password  | dayflow  |
| Host      | localhost |
| Port      | 5433     |

> ⚠️ These are local development credentials only. Never use them in production.

## Project Structure

```
dayflow/
├── frontend/          # React application
│   ├── src/
│   │   ├── api/       # API client and endpoints
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   └── ...
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/    # Environment, database, CORS
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── repositories/
│   ├── prisma/
│   │   └── schema.prisma
│   └── ...
├── docker-compose.yml
├── package.json
└── README.md
```

## Security Notes

- `.env` files are gitignored and should never be committed
- Frontend environment variables are prefixed with `VITE_`
- Never put secrets (JWT, database credentials) in frontend `.env`
- The backend validates all required environment variables on startup

## License

Private — Dayflow HRMS

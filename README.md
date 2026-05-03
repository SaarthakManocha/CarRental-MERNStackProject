# Luxury Motors — Car Rental Management System

A full-stack car rental management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Features a premium showroom experience for customers to browse and book luxury vehicles, and a comprehensive admin dashboard for fleet and booking management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

---

## Features

### Customer Features
- **User Registration & Authentication** — Secure JWT-based signup/login with role-based access
- **Showroom & Fleet Browsing** — Browse 170+ luxury vehicles organized by brand with dynamic filtering
- **Vehicle Detail Page** — View full specifications, performance data, and high-res imagery
- **Booking System** — Select date ranges with real-time availability checking and pricing
- **My Bookings** — Track active, completed, and cancelled bookings with status filters

### Admin Features
- **Admin Dashboard** — Real-time statistics (revenue, fleet size, active/completed/cancelled bookings)
- **Fleet Management** — Search, sort (alphabetical), enable/disable vehicles, and view booking status
- **Add Vehicle** — Dedicated form with image upload (drag-and-drop), performance specs, and drivetrain config
- **Booking Schedule** — Table and Timeline views, status filters, inline status updates, CSV export
- **Vehicle Image Upload** — Admin can upload vehicle images directly via the web interface

### UI/UX
- **Premium Dark Theme** — Consistent dark aesthetic with glassmorphism accents
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Smooth Animations** — Page transitions, hover effects, and micro-interactions via Framer Motion
- **Accessibility** — Supports reduced-motion preferences
- **Modern Typography** — Sora + Space Grotesk font pairing

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router v7, Vite 8, Framer Motion, Axios |
| **Backend** | Node.js, Express.js 5, Mongoose ODM, JWT Authentication |
| **Database** | MongoDB (local or Atlas) |
| **Styling** | Vanilla CSS with CSS custom properties (design tokens) |
| **Dev Tools** | Nodemon, ESLint, Vite HMR |

---

## Project Structure

```
MERN Proj/
├── client/                   # React frontend (Vite)
│   ├── public/
│   │   └── vehicle-images/   # Static vehicle image assets (.webp)
│   ├── src/
│   │   ├── api/              # Axios API layer
│   │   ├── components/       # Reusable UI components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── animations/   # Background accents, visual effects
│   │   │   ├── cards/        # Vehicle and booking cards
│   │   │   ├── feedback/     # Error handling components
│   │   │   ├── guards/       # Route protection (auth, roles)
│   │   │   └── layout/       # Navbar, Footer, AdminShell, PageWrapper
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── hooks/            # Custom hooks (useAuth)
│   │   ├── pages/            # Route-level page components
│   │   │   └── admin/        # Admin pages (Dashboard, ManageVehicles, etc.)
│   │   ├── styles/           # Additional CSS modules
│   │   └── utils/            # Utility functions (image resolver, error handling)
│   ├── vercel.json           # Vercel SPA routing config
│   └── vite.config.js        # Vite config with API proxy
│
├── server/                   # Express backend
│   ├── config/               # Database and environment configuration
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth, validation, error handling, file upload
│   ├── models/               # Mongoose schemas (User, Vehicle, Booking)
│   ├── routes/               # Express route definitions
│   ├── seed/                 # Database seeding scripts
│   └── server.js             # Application entry point
│
├── data/                     # CSV data files for seeding
├── .env.example              # Environment variable template
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** — either:
  - Local installation ([Download](https://www.mongodb.com/try/download/community)), or
  - MongoDB Atlas free cluster ([Setup](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SaarthakManocha/CarRental-MERNStackProject.git
cd CarRental-MERNStackProject
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) section below).

### 4. Seed the Database

```bash
cd server
npm run seed
```

This populates the database with 170 luxury vehicles and an admin account.

### 5. Run the Application

```bash
# Terminal 1 — Start the backend server
cd server
npm run dev

# Terminal 2 — Start the frontend dev server
cd client
npm run dev
```

The application will be available at **http://localhost:5173**

---

## Environment Variables

Create a `.env` file in the project root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/carrental
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/carrental` |
| `JWT_SECRET` | Secret key for JWT token signing | *Required* |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `NODE_ENV` | Application environment | `development` |

---

## Running the Application

### Development Mode

```bash
# Backend (port 5000)
cd server
npm run dev

# Frontend (port 5173 with HMR)
cd client
npm run dev
```

### Production Build

```bash
cd client
npm run build    # Generates optimized build in dist/
npm run preview  # Preview the production build locally
```

---

## Database Seeding

The seed script creates:
- **170 luxury vehicles** across 15 premium brands (Ferrari, Lamborghini, Porsche, McLaren, BMW, Mercedes-Benz, Audi, Aston Martin, Bentley, Rolls-Royce, Maserati, Bugatti, Pagani, Koenigsegg, Lotus)
- **1 admin account** for testing

```bash
cd server
npm run seed
```

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@carrental.dev` |
| Password | `Admin@123` |

> Register a new account through the UI to test the customer experience.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/auth/me` | Get current user profile | Required |

### Vehicles
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/vehicles` | List vehicles (with filters) | Public |
| `GET` | `/api/vehicles/brands` | Get all brand names | Public |
| `GET` | `/api/vehicles/brand/:brand` | Get vehicles by brand | Public |
| `GET` | `/api/vehicles/:id` | Get vehicle details | Public |
| `GET` | `/api/vehicles/:id/availability` | Check date availability | Public |
| `POST` | `/api/vehicles` | Add new vehicle | Admin |
| `POST` | `/api/vehicles/upload-image` | Upload vehicle image | Admin |
| `PUT` | `/api/vehicles/:id` | Update vehicle | Admin |
| `DELETE` | `/api/vehicles/:id` | Delete vehicle | Admin |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/bookings` | Create a booking | Customer |
| `GET` | `/api/bookings/my` | Get my bookings | Customer |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel my booking | Customer |
| `GET` | `/api/bookings/all` | Get all bookings | Admin |
| `PATCH` | `/api/bookings/:id/status` | Update booking status | Admin |

---

## Deployment

### Backend — Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect the GitHub repository
3. Set **Root Directory** to `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`)

### Frontend — Vercel
1. Import the repository on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. **Framework Preset**: Vite
4. Add environment variable: `VITE_API_URL` = `https://your-backend.onrender.com/api`

---

## License

This project was developed as part of a MERN Stack academic project.

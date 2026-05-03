# 🚗 Car Rental Management System — Task Tracker

## Phase 1: Project Scaffolding

- [x] Initialize Vite React app (`client/`)
- [x] Initialize Express server (`server/`)
- [x] Install frontend deps (react-router-dom, framer-motion, axios, react-hot-toast, react-datepicker, react-icons)
- [x] Install backend deps (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, express-validator)
- [x] Install nodemon (dev dependency)
- [x] Update server package.json (scripts, type: module)
- [x] Create folder structure (all subdirectories)
- [x] Setup `.gitignore`, `.env.example`

## Phase 2: Backend — Models, Middleware, Auth

- [x] MongoDB connection (`config/db.js`)
- [x] User model with bcrypt
- [x] Vehicle model
- [x] Booking model
- [x] JWT auth middleware
- [x] Role-check middleware
- [x] Error handler middleware
- [x] Token generation utility

## Phase 3: Backend — Controllers, Routes, Seed

- [x] Auth controller (register, login, me)
- [x] Vehicle controller (CRUD + brand filtering + availability)
- [x] Booking controller (create, cancel, list, admin)
- [x] Route files
- [x] Seed script (~170 cars from CSV shortlist)

## Phase 4: Frontend — Design System & Layout

- [x] Global CSS (design tokens, dark theme)
- [x] Animations CSS (keyframes)
- [x] Navbar (glassmorphism + scroll effect)
- [x] Footer
- [x] PageWrapper (Framer Motion transitions)
- [x] Sidebar (admin)

## Phase 5: Frontend — ReactBits Animated Components

- [x] SplitText / BlurText
- [x] SpotlightCard
- [x] TiltedCard
- [x] AnimatedList
- [x] Magnet
- [x] GlitchText
- [x] Advanced hover interactions (buttons, links, cards)
- [x] Image motion effects (tilt, rotate, parallax)
- [x] Animated background accents (aurora, beams, subtle noise)
- [x] Iterative animation tuning pass after each major page

## Phase 6: Frontend — Auth Pages + Context

- [x] AuthContext
- [x] Login page
- [x] Register page
- [x] ProtectedRoute / RoleGuard

## Phase 7: Frontend — Landing Page

- [x] Hero section with animated text
- [x] Featured brands carousel
- [x] How it works section
- [x] CTA section

## Phase 8: Frontend — Showroom (Brand Gallery)

- [x] brands.js data file (38 brands)
- [x] BrandCard component
- [x] Showroom page

## Phase 9: Frontend — Brand Fleet Page

- [x] BrandFleet page
- [x] VehicleCard component
- [x] Filters (type, price)

## Phase 10: Frontend — Vehicle Detail + Booking

- [x] VehicleDetail page
- [x] Date picker
- [x] Booking form
- [x] Price calculator

## Phase 11: Frontend — Customer Bookings

- [x] MyBookings page
- [x] BookingCard component

## Phase 12: Frontend — Admin Pages

- [x] Admin Dashboard
- [x] Manage Vehicles
- [x] Booking Schedule

## Phase 13: Polish

- [x] Page transitions
- [x] Loading states
- [x] Error handling
- [x] Responsive design
- [x] Performance pass for animation-heavy pages
- [x] Reduced-motion accessibility fallback

## Phase 14: Final

- [x] README.md
- [x] Final testing
- [x] Git setup

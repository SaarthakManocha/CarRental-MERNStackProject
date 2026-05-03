# 🚗 Car Rental Management System — Implementation Plan

> **Project #28** | MERN Stack | JWT Auth | Role-Based Access Control
> A vehicle rental platform where customers browse and book cars, and admins manage the fleet and bookings.

---

## User Review Required

> [!IMPORTANT]
> **Animation Library Choice**: The plan uses **ReactBits** (copy-paste animated components) + **Framer Motion** (page transitions, entrance animations). Both are well-documented and viva-friendly. Please confirm this combo works for you.

> [!IMPORTANT]
> **Design Theme**: Going with a **dark premium automotive theme** — deep blacks (#0a0a0a), electric blue (#3b82f6) as primary accent, subtle gold (#d4a843) for premium touches. Let me know if you prefer a different vibe.

> [!WARNING]
> **Viva Readiness**: Every animation and component will be written/integrated in a way you can explain. No black-box magic — you'll understand the `why` behind every piece.

> [!IMPORTANT]
> **Animation Intensity Directive (Latest)**: Frontend should be animation-heavy and visually standout. Use ReactBits components wherever suitable (hover interactions, card tilt/rotation, reveal effects, magnetic CTA, animated backgrounds), while keeping UX usable and performance acceptable.

> [!NOTE]
> **Creative Freedom + Iteration**: Animation choices are intentionally flexible. We can swap and refine effects page by page based on review feedback without changing core feature scope.

---

## Project Architecture

```
MERN Proj/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   │   ├── cars/                    # Car images
│   │   └── brands/                  # Brand logos (SVG/PNG)
│   ├── src/
│   │   ├── api/                     # Axios instance & API calls
│   │   │   ├── axios.js             # Base axios config with JWT interceptor
│   │   │   ├── authApi.js           # Login, register, logout
│   │   │   ├── vehicleApi.js        # Vehicle CRUD & search
│   │   │   └── bookingApi.js        # Booking CRUD
│   │   ├── assets/                  # Static assets, images, icons
│   │   ├── components/              # Reusable UI components
│   │   │   ├── animations/          # ReactBits animated components
│   │   │   │   ├── SplitText.jsx
│   │   │   │   ├── BlurText.jsx
│   │   │   │   ├── GlitchText.jsx
│   │   │   │   ├── SpotlightCard.jsx
│   │   │   │   ├── TiltedCard.jsx
│   │   │   │   ├── AnimatedList.jsx
│   │   │   │   └── Magnet.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx       # Animated navbar with glassmorphism
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx      # Admin sidebar
│   │   │   │   └── PageWrapper.jsx  # Framer Motion page transition wrapper
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx       # Animated button with hover effects
│   │   │   │   ├── Input.jsx        # Animated input with focus effects
│   │   │   │   ├── Modal.jsx        # Spring-based modal
│   │   │   │   ├── Toast.jsx        # Notification toasts
│   │   │   │   ├── Loader.jsx       # Skeleton/shimmer loader
│   │   │   │   └── DatePicker.jsx   # Date range picker
│   │   │   ├── cards/
│   │   │   │   ├── BrandCard.jsx    # Brand showcase card with logo
│   │   │   │   ├── VehicleCard.jsx  # 3D tilt car card
│   │   │   │   └── BookingCard.jsx  # Booking info card
│   │   │   └── guards/
│   │   │       ├── ProtectedRoute.jsx
│   │   │       └── RoleGuard.jsx    # Role-based route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   └── useScrollReveal.js   # Scroll-triggered animations
│   │   ├── data/
│   │   │   └── brands.js            # Brand metadata (name, logo, tagline, accent color)
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Hero + featured brands + CTA
│   │   │   ├── Login.jsx            # Animated login form
│   │   │   ├── Register.jsx         # Animated register form
│   │   │   ├── Showroom.jsx         # Brand gallery (Real Racing 3 style)
│   │   │   ├── BrandFleet.jsx       # Cars within a brand (/fleet/:brand)
│   │   │   ├── VehicleDetail.jsx    # Single vehicle + booking form
│   │   │   ├── MyBookings.jsx       # Customer's bookings
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx    # Admin overview with stats
│   │   │   │   ├── ManageVehicles.jsx # CRUD vehicles
│   │   │   │   ├── AddVehicle.jsx   # Add/edit vehicle form
│   │   │   │   └── BookingSchedule.jsx # Full booking calendar/list
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── styles/
│   │   │   ├── index.css            # Global styles & CSS variables
│   │   │   ├── animations.css       # Keyframe animations
│   │   │   └── components/          # Component-specific styles
│   │   ├── utils/
│   │   │   ├── constants.js         # App constants, brand list
│   │   │   └── helpers.js           # Date formatting, price calc, etc.
│   │   ├── App.jsx                  # Root with router + AnimatePresence
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── env.js                   # Environment variable validation
│   ├── controllers/
│   │   ├── authController.js        # Register, login, me, logout
│   │   ├── vehicleController.js     # CRUD + search + availability
│   │   └── bookingController.js     # Book, cancel, list, admin-list
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   ├── roleCheck.js             # Role-based access middleware
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validate.js              # Request validation middleware
│   ├── models/
│   │   ├── User.js                  # User schema (admin/customer)
│   │   ├── Vehicle.js               # Vehicle schema
│   │   └── Booking.js               # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── bookingRoutes.js
│   ├── utils/
│   │   ├── generateToken.js         # JWT token generation
│   │   └── dateOverlap.js           # Date range overlap checker
│   ├── seed/
│   │   └── seedData.js              # Seed script with sample cars + admin
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── .gitignore
├── .env.example                     # Environment variable template
└── README.md                        # Full setup & usage guide
```

---

## Database Design (MongoDB Schemas)

### User Schema

```javascript
{
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },  // bcrypt hashed
  role:      { type: String, enum: ['admin', 'customer'], default: 'customer' },
  phone:     { type: String },
  createdAt: { type: Date, default: Date.now }
}
```

### Vehicle Schema

```javascript
{
  name:         { type: String, required: true },      // e.g. "Toyota Camry 2024"
  type:         { type: String, enum: ['sedan', 'suv', 'hatchback', 'luxury', 'sports', 'truck'], required: true },
  brand:        { type: String, required: true },      // e.g. "Toyota"
  model:        { type: String, required: true },      // e.g. "Camry"
  year:         { type: Number, required: true },
  dailyRate:    { type: Number, required: true },      // Price per day in ₹
  seats:        { type: Number, required: true },
  transmission: { type: String, enum: ['automatic', 'manual'] },
  fuelType:     { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'] },
  image:        { type: String },                      // Image URL
  description:  { type: String },
  isAvailable:  { type: Boolean, default: true },      // Admin can toggle this
  createdAt:    { type: Date, default: Date.now }
}
```

### Booking Schema

```javascript
{
  user:       { type: ObjectId, ref: 'User', required: true },
  vehicle:    { type: ObjectId, ref: 'Vehicle', required: true },
  startDate:  { type: Date, required: true },
  endDate:    { type: Date, required: true },
  totalPrice: { type: Number, required: true },        // Calculated: days × dailyRate
  status:     { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  createdAt:  { type: Date, default: Date.now }
}
```

### Critical Logic: Date Overlap Detection

```javascript
// To check if a vehicle is available for [startDate, endDate]:
// Find any ACTIVE booking for this vehicle where dates overlap
const conflict = await Booking.findOne({
  vehicle: vehicleId,
  status: "active",
  $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
});
// If conflict exists → vehicle is NOT available for those dates
```

---

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint    | Access        | Description              |
| ------ | ----------- | ------------- | ------------------------ |
| POST   | `/register` | Public        | Register new customer    |
| POST   | `/login`    | Public        | Login → returns JWT      |
| GET    | `/me`       | Authenticated | Get current user profile |

### Vehicle Routes (`/api/vehicles`)

| Method | Endpoint            | Access | Description                                                        |
| ------ | ------------------- | ------ | ------------------------------------------------------------------ |
| GET    | `/`                 | Public | Browse all vehicles (with filters: type, brand, date range, price) |
| GET    | `/brands`           | Public | Get all brands with car count per brand                            |
| GET    | `/brand/:brand`     | Public | Get all vehicles for a specific brand                              |
| GET    | `/:id`              | Public | Get single vehicle details                                         |
| POST   | `/`                 | Admin  | Add new vehicle                                                    |
| PUT    | `/:id`              | Admin  | Update vehicle                                                     |
| DELETE | `/:id`              | Admin  | Delete vehicle                                                     |
| GET    | `/:id/availability` | Public | Check availability for date range                                  |

### Booking Routes (`/api/bookings`)

| Method | Endpoint      | Access   | Description                         |
| ------ | ------------- | -------- | ----------------------------------- |
| POST   | `/`           | Customer | Create booking (with overlap check) |
| GET    | `/my`         | Customer | Get customer's bookings             |
| PATCH  | `/:id/cancel` | Customer | Cancel own booking                  |
| GET    | `/all`        | Admin    | Get all bookings (full schedule)    |
| PATCH  | `/:id/status` | Admin    | Update booking status               |

---

## JWT Authentication Flow

```
1. User registers/logs in → Server generates JWT with { userId, role }
2. Token stored in localStorage on client
3. Axios interceptor attaches "Authorization: Bearer <token>" to every request
4. Server middleware verifies token → attaches user to req.user
5. roleCheck middleware verifies req.user.role for admin-only routes
6. Token expires after 7 days → user must re-login
```

---

## Frontend Pages & Animation Strategy

### 1. Landing Page (`/`)

**Layout**: Full-screen hero → Featured brands showcase → How it works → CTA
**Animations**:

- **Hero**: ReactBits `SplitText` or `BlurText` for the headline "Drive Your Dream Car Today"
- **Background**: Subtle gradient animation or ReactBits `Aurora`/`Beams` background
- **Featured brands**: Animated brand logo ticker / carousel with glow effects
- **CTA buttons**: Magnetic hover effect (ReactBits `Magnet`) + glow pulse
- **Scroll sections**: `useScrollReveal` hook → elements fade/slide in on scroll
- **"Explore the Showroom"** CTA links directly to the brand gallery

### 2. Login & Register Pages (`/login`, `/register`)

**Layout**: Split-screen — animated visual on left, form on right
**Animations**:

- Form slides in from right with Framer Motion
- Input fields animate on focus (border glow, label float)
- Submit button has loading spinner animation
- Success → confetti/checkmark micro-animation
- Error → shake animation on form

### 3. 🏎️ Showroom — Brand Gallery (`/showroom`) ⭐ NEW

**Inspiration**: Real Racing 3 car shop — manufacturer logos arranged in a premium grid
**Layout**: Full-page grid of brand cards — each card shows brand logo, name, tagline, and car count
**Animations**:

- **Entrance**: Cards stagger in with Framer Motion spring cascade (each 80ms delay)
- **Brand cards**: ReactBits `SpotlightCard` — cursor-following spotlight glow effect
- **Hover**: Card lifts (translateY + shadow deepens), brand logo scales subtly, car count badge pulses
- **Click**: Card expands briefly before navigating to brand fleet (layoutId transition)
- **Background**: Subtle animated gradient or ReactBits `Beams`
- **Search**: Live search bar to filter brands with smooth show/hide animations

**Brand Data (client-side `data/brands.js`)**:

```javascript
const brands = [
  { slug: 'mercedes-benz', name: 'Mercedes-Benz', tagline: 'The Best or Nothing', logo: '/brands/mercedes.svg', accent: '#00adef' },
  { slug: 'bmw',           name: 'BMW',           tagline: 'Sheer Driving Pleasure', logo: '/brands/bmw.svg',      accent: '#0066b1' },
  { slug: 'audi',          name: 'Audi',          tagline: 'Vorsprung durch Technik', logo: '/brands/audi.svg',     accent: '#bb0a30' },
  { slug: 'lamborghini',   name: 'Lamborghini',   tagline: 'Expect the Unexpected',  logo: '/brands/lambo.svg',    accent: '#ddb321' },
  { slug: 'bugatti',       name: 'Bugatti',       tagline: 'Ettore's Dream',         logo: '/brands/bugatti.svg',  accent: '#c8102e' },
  { slug: 'porsche',       name: 'Porsche',       tagline: 'There Is No Substitute', logo: '/brands/porsche.svg',  accent: '#d5001c' },
  { slug: 'honda',         name: 'Honda',         tagline: 'The Power of Dreams',    logo: '/brands/honda.svg',    accent: '#cc0000' },
  { slug: 'acura',         name: 'Acura',         tagline: 'Precision Crafted',      logo: '/brands/acura.svg',    accent: '#1a1a1a' },
  { slug: 'toyota',        name: 'Toyota',        tagline: "Let's Go Places",        logo: '/brands/toyota.svg',   accent: '#eb0a1e' },
  { slug: 'ferrari',       name: 'Ferrari',       tagline: 'We Are The Competition', logo: '/brands/ferrari.svg',  accent: '#dc143c' },
  { slug: 'rolls-royce',   name: 'Rolls-Royce',   tagline: 'Inspiring Greatness',    logo: '/brands/rr.svg',       accent: '#680021' },
  { slug: 'mclaren',       name: 'McLaren',       tagline: 'Brave New World',        logo: '/brands/mclaren.svg',  accent: '#ff8000' },
];
```

### 4. Brand Fleet Page (`/fleet/:brand`) ⭐ NEW

**Inspiration**: Real Racing 3 — tapping a manufacturer reveals their cars
**Layout**: Brand hero header (logo + name + tagline with brand accent color) → Car grid below
**Animations**:

- **Brand header**: Logo fades in + name uses `SplitText` animation, accent-colored gradient
- **Car cards**: ReactBits `TiltedCard` or `SpotlightCard` — 3D tilt on hover
- **Staggered entrance**: Each car card delays 60ms after the previous
- **Filters**: Type (sedan/SUV/sports), price range — smooth layout animation on filter change
- **Empty state**: "No cars available from [Brand]" with animated illustration
- **Back button**: Animated return to showroom

### 5. Vehicle Detail Page (`/vehicle/:id`)

**Layout**: Large car image + vehicle specs + date picker + booking form
**Animations**:

- Image zoom-in entrance with subtle parallax
- Brand badge in corner with brand accent color
- Specs slide in from left (staggered list)
- Date picker has smooth expand/collapse
- "Book Now" button — magnetic hover + scale effect
- Price calculation animates when dates change (number counting up)

### 6. My Bookings Page (`/my-bookings`)

**Layout**: List/grid of booking cards with status badges, organized by brand
**Animations**:

- ReactBits `AnimatedList` — items slide in one by one
- Each booking card shows brand logo + car name
- Cancel button has confirmation modal (spring pop-in)
- Status badges pulse subtly
- Empty state has a fun animated illustration

### 7. Admin Dashboard (`/admin/dashboard`)

**Layout**: Stats cards + recent bookings + fleet overview by brand
**Animations**:

- Stat numbers animate (count-up from 0)
- Cards use `SpotlightCard` effect
- Brand distribution chart (pie/bar) animates on load
- Sidebar navigation with active indicator animation

### 8. Admin: Manage Vehicles (`/admin/vehicles`)

**Layout**: Table/grid of all vehicles (filterable by brand) with add/edit/delete actions
**Animations**:

- Table rows stagger in
- Brand filter dropdown with smooth show/hide
- Delete confirmation modal
- Edit form slides in as a drawer/modal
- When adding vehicle → brand dropdown required
- Success/error toast notifications pop in from corner

### 9. Admin: Booking Schedule (`/admin/bookings`)

**Layout**: Full booking list with filters (date, vehicle, brand, status)
**Animations**:

- List view with animated filters
- Status update triggers smooth badge color transition
- Timeline/calendar view for visual schedule

---

## Navbar Design

- **Glassmorphism**: Semi-transparent with backdrop blur
- **Scroll behavior**: Shrinks and increases blur on scroll
- **Logo**: Animated on load
- **Nav links**: Underline sweep animation on hover
- **Auth buttons**: Glow border on hover, magnetic pull effect
- **Mobile**: Animated hamburger → slide-in drawer

---

## ReactBits Components We'll Use

| Component                | Where Used                                      |
| ------------------------ | ----------------------------------------------- |
| **SplitText / BlurText** | Landing hero headline, page titles, brand names |
| **GlitchText**           | 404 page, special accents                       |
| **SpotlightCard**        | Brand cards in showroom, stat cards             |
| **TiltedCard**           | Car cards in brand fleet page                   |
| **AnimatedList**         | Booking lists, vehicle lists                    |
| **Magnet**               | CTA buttons, nav buttons                        |
| **Aurora / Beams**       | Landing page, showroom background               |

> [!NOTE]
> We will extend beyond this baseline list whenever a page benefits from additional ReactBits patterns (background effects, interaction hovers, motion wrappers, image transforms).

---

## Design System (CSS Variables)

```css
:root {
  /* Colors - Dark Premium Automotive */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #1a1a1a;
  --bg-card-hover: #222222;
  --bg-glass: rgba(255, 255, 255, 0.05);

  --accent-primary: #3b82f6; /* Electric Blue */
  --accent-primary-hover: #2563eb;
  --accent-secondary: #d4a843; /* Gold */
  --accent-glow: rgba(59, 130, 246, 0.3);

  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;

  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;

  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);

  /* Typography */
  --font-primary: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Effects */
  --glass-blur: blur(20px);
  --shadow-glow: 0 0 20px var(--accent-glow);
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Tech Stack & Dependencies

### Backend (`server/`)

| Package           | Purpose               |
| ----------------- | --------------------- |
| express           | Web framework         |
| mongoose          | MongoDB ODM           |
| bcryptjs          | Password hashing      |
| jsonwebtoken      | JWT tokens            |
| cors              | Cross-origin requests |
| dotenv            | Environment variables |
| express-validator | Input validation      |

### Frontend (`client/`)

| Package                  | Purpose                       |
| ------------------------ | ----------------------------- |
| react + react-dom        | UI framework                  |
| react-router-dom         | Routing                       |
| framer-motion            | Page transitions & animations |
| axios                    | HTTP client                   |
| react-hot-toast          | Toast notifications           |
| react-datepicker         | Date range selection          |
| react-icons              | Icon library                  |
| @gsap/react _(optional)_ | Complex timeline animations   |

> [!NOTE]
> ReactBits components are **copy-paste** — they don't need npm installation. We copy the component source directly into `components/animations/` and customize as needed. This is also great for viva since you own and understand the code.

---

## Proposed Changes

### Backend Setup

#### [NEW] [server.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/server.js)

Express app entry — connects to MongoDB, applies middleware (cors, json parsing, error handler), mounts routes.

#### [NEW] [db.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/config/db.js)

Mongoose connection to MongoDB Atlas/local with connection error handling.

#### [NEW] [User.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/models/User.js)

User schema with pre-save hook for bcrypt password hashing. Includes method `matchPassword()`.

#### [NEW] [Vehicle.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/models/Vehicle.js)

Vehicle schema with all fields (name, type, brand, model, year, dailyRate, seats, transmission, fuelType, image, isAvailable).

#### [NEW] [Booking.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/models/Booking.js)

Booking schema with references to User and Vehicle. Includes virtual for calculating rental duration.

#### [NEW] [auth.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/middleware/auth.js)

JWT verification middleware — extracts token from Authorization header, verifies, attaches user to `req.user`.

#### [NEW] [roleCheck.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/middleware/roleCheck.js)

Higher-order middleware: `roleCheck('admin')` — checks `req.user.role` and returns 403 if unauthorized.

#### [NEW] [authController.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/controllers/authController.js)

Handles register (hash password, create user, return token), login (verify credentials, return token), getMe.

#### [NEW] [vehicleController.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/controllers/vehicleController.js)

Full CRUD + search with filters (type, price range) + date-based availability check.

#### [NEW] [bookingController.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/controllers/bookingController.js)

Create booking (with overlap detection), get user's bookings, cancel booking, admin get-all, admin update status.

#### [NEW] [seedData.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/server/seed/seedData.js)

Seed script with **12 brands × 3-5 cars each (~40-50 vehicles)** and 1 admin account for demo. Includes real car names, specs, and daily rates reflecting luxury tiers.

**Sample seed brands & cars:**
| Brand | Cars | Daily Rate Range |
|-------|------|------------------|
| Mercedes-Benz | C-Class, E-Class, S-Class, GLE, AMG GT | ₹5,000 – ₹25,000 |
| BMW | 3 Series, 5 Series, X5, M4, i7 | ₹4,500 – ₹22,000 |
| Audi | A4, A6, Q7, RS7, e-tron GT | ₹4,500 – ₹20,000 |
| Lamborghini | Huracán, Urus, Revuelto | ₹50,000 – ₹1,50,000 |
| Bugatti | Chiron, Veyron | ₹2,00,000 – ₹5,00,000 |
| Porsche | 911 Carrera, Cayenne, Taycan | ₹15,000 – ₹45,000 |
| Honda | Civic, Accord, CR-V | ₹2,000 – ₹4,000 |
| Acura | TLX, MDX, Integra | ₹3,500 – ₹7,000 |
| Toyota | Camry, Supra, Land Cruiser | ₹2,500 – ₹8,000 |
| Ferrari | 488 GTB, SF90 Stradale, Roma | ₹60,000 – ₹2,00,000 |
| Rolls-Royce | Phantom, Ghost, Cullinan | ₹1,00,000 – ₹3,00,000 |
| McLaren | 720S, Artura, P1 | ₹55,000 – ₹1,80,000 |

---

### Frontend Setup

#### [NEW] [App.jsx](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/client/src/App.jsx)

Root component with React Router, AnimatePresence for page transitions, AuthContext provider.

#### [NEW] [AuthContext.jsx](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/client/src/context/AuthContext.jsx)

Context for auth state — user object, login/logout functions, loading state, role checks.

#### [NEW] [Showroom.jsx](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/client/src/pages/Showroom.jsx)

Brand gallery page — grid of brand cards with logos, car count, spotlight hover effect. The centrepiece of the browsing experience.

#### [NEW] [BrandFleet.jsx](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/client/src/pages/BrandFleet.jsx)

Brand-specific vehicle listing — shows all cars from a manufacturer with filters.

#### [NEW] [BrandCard.jsx](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/client/src/components/cards/BrandCard.jsx)

Premium brand showcase card — logo, name, tagline, car count, spotlight/tilt effect.

#### [NEW] [brands.js](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/client/src/data/brands.js)

Client-side brand metadata — slug, name, tagline, logo path, accent color for each manufacturer.

#### [NEW] All remaining pages listed above in the Pages section.

#### [NEW] All remaining components listed above in the Components section.

#### [NEW] All animation components from ReactBits (copied and customized).

---

### Project Root

#### [NEW] [README.md](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/README.md)

Project overview, features, screenshots placeholder, tech stack, setup instructions (clone, install, env setup, seed, run), API documentation summary, folder structure.

#### [NEW] [.gitignore](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/.gitignore)

Standard Node + React ignores (node_modules, .env, dist, etc.)

#### [NEW] [.env.example](file:///c:/Users/saart/Downloads/College%20Shit/MERN%20Proj/.env.example)

Template: `MONGO_URI`, `JWT_SECRET`, `PORT`.

---

## User Flow (Showroom-First Experience)

```
  Landing Page
       │
       ├──→ "Explore Showroom" CTA
       │         │
       │    Showroom Page (/showroom)
       │    ┌─────────────────────────────┐
       │    │  Mercedes │ BMW  │ Audi    │
       │    │  Lambo    │ Ferrari │ Porsche│
       │    │  Honda    │ Toyota │ ...    │
       │    └─────────────────────────────┘
       │              │ click brand
       │              ▼
       │    Brand Fleet (/fleet/mercedes-benz)
       │    ┌─────────────────────────────┐
       │    │  C-Class │ E-Class │ S-Class│
       │    │  GLE     │ AMG GT │        │
       │    └─────────────────────────────┘
       │              │ click car
       │              ▼
       │    Vehicle Detail (/vehicle/:id)
       │    ┌─────────────────────────────┐
       │    │  [Image]  Mercedes E-Class  │
       │    │  Pick dates → Book Now      │
       │    └─────────────────────────────┘
       │              │ book
       │              ▼
       │    My Bookings (/my-bookings)
       │
       └──→ Login / Register
```

---

## Build Order (Execution Phases)

| Phase  | What                                                                           | Est. Files |
| ------ | ------------------------------------------------------------------------------ | ---------- |
| **1**  | Initialize Vite React app + Express server skeleton                            | ~8         |
| **2**  | Backend: Models, middleware, auth system                                       | ~10        |
| **3**  | Backend: Controllers, routes, seed data (40-50 cars across 12 brands)          | ~8         |
| **4**  | Frontend: Design system (CSS), layout components (Navbar, Footer, PageWrapper) | ~8         |
| **5**  | Frontend: ReactBits animated components (copy + customize)                     | ~7         |
| **6**  | Frontend: Auth pages (Login, Register) + AuthContext                           | ~5         |
| **7**  | Frontend: Landing page (hero, featured brands showcase, CTA)                   | ~2         |
| **8**  | Frontend: **Showroom page** (brand gallery) + BrandCard component              | ~4         |
| **9**  | Frontend: **Brand Fleet page** + VehicleCard + filters                         | ~4         |
| **10** | Frontend: Vehicle detail + booking flow                                        | ~3         |
| **11** | Frontend: Customer bookings page                                               | ~2         |
| **12** | Frontend: Admin dashboard, vehicle management, booking schedule                | ~4         |
| **13** | Polish: Page transitions, loading states, error handling, responsive           | ~5         |
| **14** | Brand logos, car images, README, .gitignore, final testing                     | ~5         |

---

## Open Questions

> [!IMPORTANT]
> **MongoDB**: Are you using **MongoDB Atlas** (cloud) or **local MongoDB**? This affects the connection setup. I'll default to supporting both via the `MONGO_URI` env variable.

> [!IMPORTANT]
> **Car Images**: Should I generate car images using the image generation tool, or do you want to use placeholder URLs from the internet? Generated images will make the demo more impressive.

> [!NOTE]
> **Extra Features**: We can layer on extras later (email notifications, payment simulation, reviews, analytics charts). The core plan above covers all required features first.

---

## Verification Plan

### Automated Testing

1. **Backend API**: Test all endpoints using Thunder Client / Postman
   - Auth flow: register → login → access protected route
   - Vehicle CRUD: create, read, update, delete
   - Booking flow: book → overlap check → cancel
   - Role checks: customer can't access admin routes, and vice versa

2. **Frontend**: Browser testing
   - All animations render smoothly
   - Auth flow works end-to-end
   - Date filtering and availability checks work
   - Responsive on mobile/tablet/desktop

### Manual Verification

- Full demo walkthrough simulating the 10-minute presentation
- Viva prep: each component and logic block is documented with inline comments
- README verification: fresh clone → follow setup → app runs

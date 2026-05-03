# Backend API Smoke Test Checklist

Use this checklist before demo/viva to verify core backend flows quickly.

## Preconditions

- MongoDB is running locally.
- Root `.env` exists with `MONGO_URI` and `JWT_SECRET`.
- Seed executed at least once (`npm run seed`).
- Server running (`npm run dev`).

## 1) Health Check

- Request: `GET /api/health`
- Expected: `200` and `{"status":"ok","service":"car-rental-api"}`

## 2) Login Admin

- Request: `POST /api/auth/login`
- Body:
  ```json
  {
    "email": "admin@carrental.dev",
    "password": "Admin@123"
  }
  ```
- Expected: `200`, token present, user role = `admin`

## 3) Get Current User

- Request: `GET /api/auth/me` with `Authorization: Bearer <token>`
- Expected: `200`, same admin profile

## 4) Public Vehicle Listing

- Request: `GET /api/vehicles`
- Expected: `200`, non-zero vehicle count

## 5) Date-Range Availability Filter

- Request: `GET /api/vehicles?startDate=2026-04-15&endDate=2026-04-17`
- Expected: `200`, returns only vehicles without active overlap in that range

## 6) Register Customer

- Request: `POST /api/auth/register`
- Use a unique email each time.
- Expected: `201`, token present, role = `customer`

## 7) Customer Booking

- Request: `POST /api/bookings` with customer token
- Body:
  ```json
  {
    "vehicleId": "<vehicle_id>",
    "startDate": "2026-04-15",
    "endDate": "2026-04-17"
  }
  ```
- Expected: `201`, booking status = `active`

## 8) Overlap Protection

- Repeat same booking date range for same vehicle with another customer.
- Expected: `409` with overlap conflict message

## 9) Customer Cancellation

- Request: `PATCH /api/bookings/:id/cancel` (owner token)
- Expected: `200`, status changes to `cancelled`

## 10) Admin Booking Schedule

- Request: `GET /api/bookings/all` with admin token
- Expected: `200`, returns populated user + vehicle booking list

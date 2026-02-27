# House Rental Web Application (React + Spring Boot + MongoDB)

This is a full MVP for a house rental platform with:
- `frontend/`: React (Vite) UI
- `backend/`: Spring Boot REST API
- MongoDB as database

## Features
- Property listing with advanced filters (city, min/max rent, bedrooms, availability)
- Sorting (latest, rent asc/desc, bedrooms)
- Property details with amenities and owner/agency info
- Rental request flow with phone + preferred move-in date
- INR currency formatting in the UI
- Saved properties (favorites using localStorage)
- Add new property listing with richer metadata
- Admin panel:
  - View platform stats
  - Toggle property availability
  - Delete property
  - View rental requests
  - Approve/reject rental requests
- Backend security with role-based access (Spring Security + Basic Auth)
- Rollback support for admin changes (availability/status updates, property delete)
- Seeded with multiple Indian-city properties

## Tech Stack
- Frontend: React, React Router, Vite
- Backend: Spring Boot 3, Spring Web, Spring Data MongoDB
- Database: MongoDB

## Run Locally

### 1) Start MongoDB
Default URI used by backend:
- `mongodb://localhost:27017/house_rental_db`

Override with env var:
```bash
export MONGODB_URI="mongodb://localhost:27017/house_rental_db"
```

### 2) Run backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

Default credentials (change via env vars):
- Admin: `admin / Admin@123`
- User: `user / User@123`

### 3) Run frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Main API Endpoints

### Properties
- `GET /api/properties`
  - Query params: `city`, `minRent`, `maxRent`, `minBedrooms`, `availableOnly`, `sortBy`
- `GET /api/properties/{id}`
- `POST /api/properties`
- `PATCH /api/properties/{id}/availability?available=true|false`
- `DELETE /api/properties/{id}`

### Rental requests
- `POST /api/rental-requests`
- `GET /api/rental-requests?status=PENDING|APPROVED|REJECTED`
- `PATCH /api/rental-requests/{id}/status?status=PENDING|APPROVED|REJECTED`
- `GET /api/rental-requests/property/{propertyId}`

### Admin rollback
- `GET /api/admin/changes`
- `POST /api/admin/rollback/{changeId}`

### Security rules
- Public:
  - `GET /api/properties/**`
  - `POST /api/rental-requests`
  - `GET /api/rental-requests/property/{propertyId}`
- Admin-auth required:
  - `POST/PATCH/DELETE /api/properties/**`
  - `GET/PATCH /api/rental-requests/**`
  - `/api/admin/**`

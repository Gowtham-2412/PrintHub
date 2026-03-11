# Business System

Full-stack print-service management app with:
- Customer flow for authentication, selecting services, uploading files, placing orders, and tracking order status.
- Admin panel for managing services, reviewing orders, updating status, and finalizing payable amount.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Multer, Cloudinary

## Project Structure

```text
.
|- client/   # React + Vite frontend
|- server/   # Express + MongoDB backend
```

## Features

- User registration and login with JWT
- Role-based behavior (`costumer` and `owner`)
- Service catalog (active/inactive, price/unit management)
- Cart workflow with file upload and instructions
- Order lifecycle:
  - Create order with files
  - Customer: view own orders
  - Admin: view all orders, update status, finalize total amount
- Cloudinary-backed file storage and signed URLs for access

## Environment Variables

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Local Setup

### 1) Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2) Run backend

```bash
cd server
npm start
```

Backend runs on `http://localhost:5000`.

### 3) Run frontend

```bash
cd client
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## API Base

Frontend Axios base URL is:

`http://localhost:5000/api`

Main route groups:
- `/api/auth` (register/login)
- `/api/service` (list/create/update/delete services)
- `/api/order` (create orders, list orders, update status/pricing)

## Notes

- Admin-only UI is available under `/admin`.
- To access admin actions, the user must have `role: "owner"` in the database.
- Sample Admin details
```bash
email: admin@printhub.com
password: admin@1234
```

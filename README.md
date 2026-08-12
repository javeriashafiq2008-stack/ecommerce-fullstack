# Full-Stack E-Commerce Platform

A full-stack e-commerce web application built with React, Node.js, Express, MySQL, and Sequelize.

The application provides a complete shopping experience with user authentication, product browsing, cart management, checkout, vendor functionality, user profiles, and an administrative dashboard.

## Features

### Authentication and User Management

- User registration and login
- JWT-based authentication
- HTTP-only authentication cookies
- Role-based access control
- Buyer, Vendor, and Admin roles
- Protected routes
- User profile management
- Profile image upload using Cloudinary

### Product and Shopping

- Browse products
- Product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Cart management
- Checkout functionality
- Order creation

### Vendor Dashboard

- Vendor dashboard
- Product creation
- Vendor product management
- Vendor-specific product access

### Admin Dashboard

- Dashboard statistics
- View users
- View vendors
- View products
- Delete products
- View orders
- Update order status
- Role-protected administrative routes

### User Profile

- View account information
- Edit profile information
- Upload and update profile image
- Display account role
- Display membership information
- Cart statistics

## Technology Stack

### Frontend

- React
- JavaScript
- React Router
- Redux Toolkit
- React Context API
- Axios
- Tailwind CSS
- Lucide React
- Vite

### Backend

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT
- bcrypt
- Multer

### Services

- Cloudinary for image storage
- Vercel for frontend deployment
- Railway for backend and database deployment

## Project Structure

```text
ecommerce-fullstack/
│
├── Frontend/
│   └── ecommerce/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── features/
│       │   ├── context/
│       │   ├── api/
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── services/
│   ├── server.js
│   └── package.json
│
└── README.md

# 🛒 AgroMart Farming 

eKart Farming is a full-stack web application built using the MERN stack, designed to simulate a modern agricultural e-commerce platform. It enables users to browse products, place orders, manage carts, and track transactions, while providing admin and seller dashboards for managing inventory, orders, and analytics.
The project emphasizes clean UI/UX, structured backend APIs, and seamless frontend-backend integration.

---

# 🚀 Key Features

- Product Marketplace – Browse and view farming products
- Cart & Checkout System – Add items, manage cart, and place orders
- Authentication System – Secure login/register functionality
- Order Management – Track orders and view order details
- Payment Integration UI – Simulated payment workflow
- Admin Dashboard – Manage users, products, and orders
- Seller Dashboard – Add products, view analytics, track sales
- Analytics Panel – Visual insights using charts
- Modern UI – Dark theme with responsive and clean design
- REST API Integration – Full frontend-backend communication

---


# 🛠 Tech Stack

- Frontend:React (Vite), CSS (Custom styling + responsive layout), Recharts (analytics), Framer Motion (UI animations)
- Backend:Node.js, Express.js,
- Database:MongoDB (Atlas)
- Architecture:REST API (No WebSockets), Client–Server model

---

# 📁 Project Structure

```
ekart-farming/
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI Components (Navbar, Cards, etc.)
│   │   ├── context/       # Auth, Cart, Data Context
│   │   ├── pages/
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── auth/      # Login, Register, Reset Password
│   │   │   ├── customer/  # Cart, Orders, Checkout, Home
│   │   │   └── seller/    # Seller dashboard & analytics
│   │   ├── services/      # API calls (api.js, authService.js)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── server/                # Backend (Node + Express)
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models (User, Product, Order)
│   ├── routes/            # API routes
│   ├── index.js           # Entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# 🔗 Core Functional Flow

- User registers / logs in
- Products fetched from backend
- User adds items to cart
- Checkout → Order stored in MongoDB
- Admin/Seller views analytics and manages data

---


# ⚙️ Setup Instructions

1. Clone repository
git clone https://github.com/your-username/ekart-farming.git
2. Install dependencies
```
Frontend
cd client
npm install
npm run dev
- Backend
cd server
npm install
node index.js
```
3. Environment Variables (Backend)

Create .env inside server/:

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

PORT=5000

---

# 🌐 Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

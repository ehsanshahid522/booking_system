# BarberPro – Barber Booking System

A complete, production-ready mobile application and backend for managing barber shop appointments, user schedules, and real-time chat. The project is split into two parts: a React Native mobile frontend and a Node.js/MongoDB REST API backend.

## 📱 Frontend (Mobile App)

Built with **React Native** and **Expo Router** (v6), featuring a premium dark luxury theme (`#0D0D0D` and Gold accents).

### Features (30+ Screens)
- **3 Distinct Panels**: 
  - **👤 Customer**: Search barbers, view services, book appointments (4-step flow), manage booking history, and chat.
  - **✂️ Barber**: Dashboard, availability calendar, accept/reject booking requests, schedule timeline, and view earnings.
  - **🛡️ Admin**: Comprehensive dashboard, revenue charts, service CRUD, customer CRM, payment history, and shop settings.
- **Role-Based Authentication**: Seamless navigation between panels based on the logged-in role.
- **Shared UI Kit**: Customizable components like `Avatar`, `StatusBadge`, `StarRating`, and `BookingCard`.

To run the frontend:
```bash
cd Frontend
npm install
npx expo start
```

## ⚙️ Backend (REST API)

A robust **Node.js** and **Express.js** API using **MongoDB** for data persistence.

### Features
- **Authentication**: JWT-based auth with bcrypt password hashing.
- **9 Mongoose Models**: User, Barber, Customer, Booking, Service, Message, Notification, Payment, Review.
- **Real-time Engine**: **Socket.io** integration for:
  - Live chat messaging and typing indicators.
  - Real-time booking status updates (From Barber to Customer).
  - Admin broadcast notifications.
- **Data Integrity**: Pre/Post save hooks in Mongoose (e.g., automatically calculating average barber ratings when a new review is submitted).
- **Security**: Protected routes, role-based access control, global error trapping, and helmet integration.

To run the backend:
```bash
cd Backend
npm install
npm run dev
```
*(Requires a MongoDB instance running on `localhost:27017` or configured via `.env`)*

## 🛠️ Tech Stack
- **Frontend**: React Native, Expo, Expo Router, Async Storage.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io, JWT.
- **Design Elements**: Custom dark/gold color palette.

---
*Created as a comprehensive solution for modern barber shops to manage their digital presence, improve customer communication, and streamline scheduling.*

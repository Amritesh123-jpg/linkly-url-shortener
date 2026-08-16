<div align="center">

# 🔗 Linkly – Modern URL Shortener

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-red?logo=redis)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

Production-ready Full Stack URL Shortener built with **Next.js**, **Node.js**, **Express.js**, **MongoDB Atlas**, and **Redis**.

Create short links, track analytics, generate QR codes, and manage URLs from a modern dashboard with secure JWT authentication and automatic token refresh.

### 🌐 Live Demo

**Frontend:** https://linkly-url-shortener.vercel.app

**Backend:** https://linkly-url-shortener-1vhl.onrender.com

</div>

---

# 📸 Project Preview

## Home

![Home](assets/home.png)

---

## Dashboard

![Dashboard](assets/dashboard.png)

---

## URL Management

![URL Management](assets/urls.png)

---

## Analytics

![Analytics](assets/analytics.png)

---

# ✨ Features

## Authentication

- JWT Authentication
- Access Token + Refresh Token
- Secure Signup/Login
- Protected Routes
- HttpOnly Refresh Token Cookie
- Refresh Token Storage using Redis
- Automatic Access Token Refresh
- Concurrent Refresh Request Handling
- Logout
- Role-based Authorization

## URL Management

- Create Short URLs
- Custom Alias
- Expiry Support
- Permanent Links
- Delete URLs
- Restore Expired URLs
- Search & Filter
- Tag Support
- Pagination
- Click Tracking

## Analytics

- Total URLs
- Total Clicks
- Active URLs
- Expired URLs
- Average Clicks per URL
- Most Clicked URL
- Click History
- Clicks Over Time
- Top Performing URLs

## Additional Features

- QR Code Generation
- Automatic Website Title Detection
- Automatic Favicon Detection
- Open Graph Metadata
- URL Validation
- Responsive Dashboard

---

# 🔒 Security

Linkly implements multiple layers of security to protect APIs, authentication, and user data.

- Helmet
- Rate Limiter
- MongoDB Sanitization
- XSS Protection
- HPP
- CORS
- Compression
- JWT Authentication
- HttpOnly Refresh Token Cookie
- Redis-backed Refresh Token Validation
- Password Hashing using bcrypt
- Protected API Routes
- Role-based Authorization

---

# ⚡ Authentication Flow

Linkly uses a **JWT Access Token + Refresh Token** authentication architecture.

```text
                    Login / Signup
                          │
                          ▼
                  Express Backend
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       Access Token              Refresh Token
             │                         │
             │                  HttpOnly Cookie
             │                         │
             │                         ▼
             │                    Redis (Upstash)
             │
             ▼
       Frontend Session
             │
             ▼
       Protected APIs
```

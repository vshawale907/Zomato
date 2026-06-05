# Zomato Clone – Full-Stack Application

A **production-quality Zomato clone** built with **React + Vite + Tailwind CSS** (frontend) and **Java 21 + Spring Boot 3 + MySQL** (backend).

---

## 🚀 Tech Stack

### Frontend
- React 18 · Vite · Tailwind CSS 3 · Axios · React Router DOM 6 · Lucide Icons

### Backend
- Java 21 · Spring Boot 3.2.5 · Spring Security 6 · Spring Data JPA · JWT (JJWT) · MySQL 8 · Lombok

### Architecture
- REST API · Layered Architecture · DTO Pattern · Repository Pattern · Global Exception Handling · Pagination · Sorting · Filtering

---

## 📁 Project Structure

```
Zomato/
├── backend/                  # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/zomato/clone/
│       ├── config/           # Security, JWT, CORS, DataSeeder
│       ├── controller/       # REST Controllers
│       ├── dto/              # Request/Response DTOs
│       ├── entity/           # JPA Entities
│       ├── exception/        # Custom Exceptions & Global Handler
│       ├── repository/       # Spring Data Repositories
│       └── service/          # Business Logic
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI Components
│   │   ├── context/          # Auth & Cart Providers
│   │   ├── pages/            # Page Components
│   │   └── services/         # Axios Config
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml        # MySQL via Docker
└── README.md
```

---

## 🔧 Setup Instructions

### Prerequisites
- **Java 21** (JDK)
- **Maven 3.8+**
- **Node.js 18+** & npm
- **MySQL 8** (local or via Docker)

### 1. Database Setup

**Option A — Docker (recommended):**
```bash
docker compose up -d
```

**Option B — Local MySQL:**
```sql
CREATE DATABASE zomato_db;
```
Update credentials in `backend/src/main/resources/application.yml` if needed.

### 2. Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API starts at **http://localhost:8080**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173**.

---

## 👤 Demo Accounts

The app auto-seeds these accounts on first run:

| Role              | Email              | Password   |
|-------------------|--------------------|------------|
| Customer          | customer@gmail.com | password   |
| Restaurant Owner  | owner@gmail.com    | password   |
| Admin             | admin@gmail.com    | password   |

---

## 📋 Features

### Customer
- 🏠 Homepage with search, cuisine filters, pagination
- 🍽️ Restaurant details with categorized menu
- 🛒 Cart with single-restaurant validation
- 💳 Checkout with address selection & mock payment
- 📦 Order tracking with status stepper
- ❤️ Favorites / Wishlist
- ⭐ Reviews & Ratings
- 👤 Profile management with saved addresses

### Restaurant Owner
- 📊 Dashboard with revenue & order stats
- 🏪 Create / Edit / Delete restaurants
- 🍕 Full menu CRUD (items, categories, veg/non-veg)
- 📦 View & manage incoming orders (update status)

### Admin
- 📈 Platform-wide statistics
- 👥 User management (role changes, deletion)
- 🏆 Top restaurants by order count

---

## 🔒 Security

- JWT access tokens (15 min) + refresh tokens (7 days)
- BCrypt password hashing
- Role-based access control (`CUSTOMER`, `RESTAURANT_OWNER`, `ADMIN`)
- CORS configured for frontend origin
- Input validation via Jakarta Bean Validation
- SQL injection prevention via Spring Data JPA parameterized queries
- Stateless session management

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | /api/auth/register   | Register user       |
| POST   | /api/auth/login      | Login               |
| POST   | /api/auth/refresh    | Refresh token       |
| POST   | /api/auth/logout     | Logout              |

### Restaurants (Public)
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/restaurants        | List (filter/sort/page)  |
| GET    | /api/restaurants/{id}   | Details with menu        |

### Menu (Public)
| Method | Endpoint                        | Description        |
|--------|---------------------------------|--------------------|
| GET    | /api/menu/restaurant/{id}       | Menu items         |

### Cart (Authenticated)
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | /api/cart               | Get cart           |
| POST   | /api/cart/items         | Add item           |
| PUT    | /api/cart/items/{id}    | Update quantity    |
| DELETE | /api/cart/items/{id}    | Remove item        |
| DELETE | /api/cart               | Clear cart         |

### Orders (Authenticated)
| Method | Endpoint                    | Description        |
|--------|-----------------------------|--------------------|
| POST   | /api/orders                 | Place order        |
| GET    | /api/orders                 | Order history      |
| GET    | /api/orders/{id}            | Order details      |
| POST   | /api/orders/{id}/cancel     | Cancel order       |

### Reviews
| Method | Endpoint                         | Description       |
|--------|----------------------------------|-------------------|
| GET    | /api/reviews/restaurant/{id}     | Get reviews       |
| POST   | /api/reviews/restaurant/{id}     | Add review        |
| PUT    | /api/reviews/{id}                | Edit review       |
| DELETE | /api/reviews/{id}                | Delete review     |

### Favorites (Authenticated)
| Method | Endpoint                        | Description       |
|--------|---------------------------------|-------------------|
| POST   | /api/favorites/toggle/{id}      | Toggle favorite   |
| GET    | /api/favorites                  | List favorites    |

### Owner (RESTAURANT_OWNER / ADMIN)
| Method | Endpoint                               | Description          |
|--------|----------------------------------------|----------------------|
| GET    | /api/owner/dashboard/stats             | Owner stats          |
| POST   | /api/owner/restaurants                 | Create restaurant    |
| PUT    | /api/owner/restaurants/{id}            | Update restaurant    |
| DELETE | /api/owner/restaurants/{id}            | Delete restaurant    |
| POST   | /api/owner/restaurants/{id}/menu       | Add menu item        |
| PUT    | /api/owner/menu-items/{id}             | Update menu item     |
| DELETE | /api/owner/menu-items/{id}             | Delete menu item     |
| GET    | /api/owner/orders                      | View orders          |
| PUT    | /api/owner/orders/{id}/status          | Update order status  |

### Admin (ADMIN only)
| Method | Endpoint                        | Description       |
|--------|---------------------------------|-------------------|
| GET    | /api/admin/dashboard/stats      | Platform stats    |
| GET    | /api/admin/users                | List users        |
| PUT    | /api/admin/users/{id}/role      | Change user role  |
| DELETE | /api/admin/users/{id}           | Delete user       |

---

## 📄 License

This project is for educational purposes.

# Zomato Clone – Frontend Client

This is the React web client for the Zomato Clone application. It is built using modern front-end tools and configured to connect seamlessly with the Spring Boot backend REST API.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React 19 & Vite 8 (fast hot-module reloading and optimized production bundles)
- **Styling**: Tailwind CSS v4 (configured via the `@tailwindcss/vite` plugin)
- **Routing**: React Router DOM v7 (supports protected routes for logged-in sessions)
- **HTTP Client**: Axios (configured with automated request/response interceptors to attach bearer JWT tokens and handle silent token refreshes on token expiry)
- **Icons**: Lucide React & inline custom brand SVGs for social media links

---

## 🚀 Running the Client Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173** in your web browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   Bundles the optimized application files into the `dist/` directory.

---

## 📂 Key Folders

- `/src/components`: Reusable layout parts like `Navbar`, `Footer`, `FoodCard`, and `CartSidebar`.
- `/src/context`: Auth & Cart state contexts.
- `/src/pages`: User screens like `HomePage`, `RestaurantDetailsPage`, `CheckoutPage`, and role-specific dashboards (`OwnerDashboard` and `AdminDashboard`).
- `/src/services`: Central API routing using Axios instances.

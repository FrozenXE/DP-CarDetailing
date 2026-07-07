# APEX STUDIO | Premium Car Detailing Web Application

APEX STUDIO is a high-performance web application designed to streamline the management of a premium car detailing business. It provides a seamless interface for clients to browse service packages, maintain a digital garage, and schedule appointments, while providing administrators with a robust dashboard to manage studio operations.

---

## 🚀 Tech Stack
* **Frontend:** React (Vite environment), Tailwind CSS
* **Backend & Auth:** Supabase (Cloud PostgreSQL)
* **State Management:** React `useState` / `useEffect` hooks
* **Deployment/Versioning:** Git/GitHub, Vercel (recommended)

---

## 📋 Core Features
### For Clients:
* **Client Portal:** Secure authentication via Supabase Auth.
* **Detailing Menu:** An interactive, responsive catalog of premium services.
* **My Garage:** A personalized inventory management system for user vehicle fleets.
* **Reservation Wizard:** A streamlined booking interface that bridges vehicle selection with service scheduling.

### For Administrators:
* **Master Control Ledger:** A dedicated admin interface to oversee all incoming reservations.
* **Operations Matrix:** Real-time treatment status updates (Pending, In-Progress, Completed, etc.).
* **Role-Based Access Control:** Database-driven `is_admin` flag to secure studio management functions.

---

## 🛠️ Database Schema
The application relies on a normalized relational schema of 7 tables, including:
* `profiles`: Extends user data with role management (`is_admin`).
* `vehicles`: Tracks user-owned fleet assets.
* `bookings`: The central relational bridge for all service appointments.

---

## 🔑 Security & Configuration
* **Environment Variables:** Sensitive API credentials are managed via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. These are excluded from version control via `.gitignore`.
* **Security Strategy:** The project utilizes a "Development-Velocity" approach. While RLS (Row Level Security) is currently optimized for rapid feature development, the database architecture is prepared for strict production-grade security policies.

---

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/apex-studio.git](https://github.com/your-username/apex-studio.git)
    cd apex-studio
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```text
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_project_anon_key
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## ⚖️ License & Credits
Developed as an academic submission for Faculty of Information Sciences and Computer Engineering - Skopje. 

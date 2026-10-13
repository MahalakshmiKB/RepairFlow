# RepairFlow — Full-Stack Repair Management System

RepairFlow is a full-stack web application designed for small electronics repair businesses. It streamlines front-desk device check-in, repair lifecycle tracking, technician diagnostic notes, and cost management in **Indian Rupees (₹)**, while providing a customer-safe public tracking portal where clients can monitor device status using a unique tracking code.

Developed as a Computer Science Engineering college project, the codebase demonstrates a clean, layered architecture: **React (Vite) → REST API → Spring Boot (Service / DTOs) → Spring Data JPA → PostgreSQL 17**.

---

## 1. Key Features

- **Public SaaS Landing Page (`/`):** Modern SaaS homepage inspired by Linear and Stripe, featuring a hero section, device tracking lookup, and separate entry paths for customers and staff.
- **Dual Sign-In Experience:**
  - **Customer Portal (`/customer/login`):** Device owners can sign in or jump directly to tracking their repair without needing an account.
  - **Staff Portal (`/staff/login`):** Authorized shop technicians access the internal repair-management dashboard.
- **Atomic Collision-Free Tracking IDs:** Generates sequential, thread-safe identifiers such as `RF-2026-0001` and `RF-2026-0002`.
- **Public Customer Tracking Portal (`/track`):** Privacy-shielded portal allowing customers to check their repair progress with a visual stepper (`Received` → `Diagnosing` → `In Repair` → `Ready for Pickup`). Customer phone numbers, email addresses, and internal staff notes are strictly protected.
- **Full Status Audit Trail:** Every status transition automatically records the previous status, new status, timestamp, and technician notes in PostgreSQL.
- **Real-Time Shop Analytics:** Live dashboard statistics calculated directly from database records (Total, Received, Diagnosing, In Repair, Completed, Unrepairable).
- **Indian Rupees (₹) Everywhere:** All monetary figures across forms, tables, cards, and customer views are formatted using the Indian numbering system (`en-IN`), such as `₹1,500.00` and `₹1,25,000.00`.

---

## 2. Technology Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│              Frontend (React 19 + Vite)                │
│  - JavaScript (JSX, No TypeScript)                     │
│  - React Router 7 for Navigation                       │
│  - Vanilla CSS Design System (Linear / Stripe Inspired)│
│  - Centralized Fetch API Service (services/api.js)     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (Proxy / CORS)
┌───────────────────────────▼────────────────────────────┐
│          Backend (Spring Boot 3.4.3 / Java 21)         │
│  - Layered Architecture: Controller → Service → Repo   │
│  - Jakarta Bean Validation (@NotBlank, @Email, etc.)   │
│  - Global Exception Handling (@RestControllerAdvice)   │
│  - Thread-Safe Tracking ID Generation                  │
└───────────────────────────┬────────────────────────────┘
                            │ Hibernate ORM / JDBC
┌───────────────────────────▼────────────────────────────┐
│                 Database (PostgreSQL 17.5)             │
│  - Tables: repair_tickets, repair_status_history       │
│  - Indexes on tracking_id, customer_name, and status   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Project Directory Structure

```
RepairFlow/
├── frontend/
│   ├── src/
│   │   ├── components/       # StatusBadge, Modal, Alert, LoadingSpinner
│   │   ├── layouts/          # AppLayout (Sidebar + Topbar)
│   │   ├── pages/            # LandingPage, CustomerLogin, StaffLogin,
│   │   │                     # DashboardOverview, AllRepairs, NewRepair,
│   │   │                     # EditRepair, RepairDetails, CustomerTracking, NotFound
│   │   ├── services/         # api.js (Centralized Fetch API client)
│   │   ├── utils/            # currency.js (formatINR utility)
│   │   ├── index.css         # SaaS design tokens, layout, and component styles
│   │   ├── App.jsx           # React Router route hierarchy
│   │   └── main.jsx          # Root entry point
│   ├── package.json          # React 19, Lucide Icons, Vite
│   ├── vite.config.js        # Dev proxy configuration (/api → http://localhost:8080)
│   └── .env.example          # Frontend environment documentation
│
├── backend/
│   ├── src/
│   │   ├── main/java/com/repairflow/
│   │   │   ├── config/       # CorsConfig.java
│   │   │   ├── controller/   # RepairController, TrackingController, DashboardController
│   │   │   ├── dto/          # Request & Response DTOs
│   │   │   ├── entity/       # RepairTicket, RepairStatusHistory, RepairStatus enum
│   │   │   ├── exception/    # GlobalExceptionHandler, ErrorResponse, Custom Exceptions
│   │   │   ├── repository/   # RepairTicketRepository, RepairStatusHistoryRepository
│   │   │   ├── service/      # RepairService (Business logic & ID generation)
│   │   │   └── RepairFlowApplication.java
│   │   ├── main/resources/
│   │   │   └── application.properties # PostgreSQL config via environment variables
│   │   └── test/
│   │       ├── java/com/repairflow/   # RepairServiceTest, RepairControllerTest, AppTests
│   │       └── resources/             # application.properties (Isolated test DB)
│   ├── pom.xml               # Maven configuration (Spring Boot 3.4.3, Java 21)
│   ├── mvnw & mvnw.cmd       # Maven Wrapper for Windows
│   ├── .env.example          # Environment variables template
│   └── application-local.properties # Local credentials file (excluded from Git)
│
├── seed_data.sql             # Repeatable demonstration data script
├── README.md                 # Complete system documentation
└── .gitignore                # Protects secrets, node_modules, and build targets
```

---

## 4. Prerequisites

Verify installed tools using PowerShell:

```powershell
java -version       # Java 21 LTS or higher
node -v             # Node.js v20+ or v22+
npm -v              # npm 10+
```

Ensure PostgreSQL is running:
- Port: `5432`
- Database: `repairflow`

---

## 5. Database Configuration & Credentials

Credentials are never committed to version control. They are managed in two ways:

### Option A: Via Local File (Recommended for Local Dev)
Create or edit `backend/application-local.properties` (already in `.gitignore`):
```properties
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

### Option B: Via Environment Variables
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/repairflow"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
```

---

## 6. How to Run the Application on Windows

Open two separate PowerShell terminal windows:

### Terminal 1: Start the Spring Boot Backend
```powershell
cd C:\Users\Mahalakshmi\RepairFlow\backend
.\mvnw.cmd spring-boot:run
```
*The backend starts on `http://localhost:8080` and connects to PostgreSQL.*

### Terminal 2: Start the React Frontend
```powershell
cd C:\Users\Mahalakshmi\RepairFlow\frontend
npm run dev
```
*The frontend starts on `http://localhost:5173`.*

---

## 7. Application Portals & Routing

| URL Route | Purpose | Description |
|-----------|---------|-------------|
| `http://localhost:5173/` | **Landing Page** | Public SaaS homepage with hero section, quick tracking, and sign-in cards. |
| `http://localhost:5173/customer/login` | **Customer Sign In** | Customer login portal with password toggle and direct link to public tracking. |
| `http://localhost:5173/staff/login` | **Staff Sign In** | Staff portal with direct access to internal shop dashboard. |
| `http://localhost:5173/track` | **Customer Tracking** | Standalone public portal with progress stepper and privacy shields. |
| `http://localhost:5173/dashboard` | **Staff Overview** | Live shop metrics and recent ticket table. |
| `http://localhost:5173/repairs` | **All Repairs** | Search, status filters, pagination, and status update modals. |
| `http://localhost:5173/repairs/new` | **New Repair Intake** | Intake form with client/server validation and immediate tracking ID display. |
| `http://localhost:5173/repairs/:id` | **Repair Details** | Full ticket information, billing in ₹, and chronological status history timeline. |
| `http://localhost:5173/repairs/:id/edit`| **Edit Repair** | Update device details, diagnosis notes, internal notes, and costs in ₹. |

---

## 8. REST API Reference

| Method | Endpoint | Description | Request Body / Parameters |
|--------|----------|-------------|----------------------------|
| `GET` | `/api/dashboard/stats` | Live summary counts | None |
| `POST` | `/api/repairs` | Register new repair ticket | `CreateRepairRequest` JSON |
| `GET` | `/api/repairs` | Search & filter tickets | `?search=&status=&page=0&size=10` |
| `GET` | `/api/repairs/{id}` | Full ticket details | None |
| `PUT` | `/api/repairs/{id}` | Update ticket details | `UpdateRepairRequest` JSON |
| `PATCH`| `/api/repairs/{id}/status`| Update repair status | `{"status": "DIAGNOSING", "note": "..."}` |
| `DELETE`| `/api/repairs/{id}` | Delete ticket | None |
| `GET` | `/api/repairs/{id}/history`| Status transition timeline | None |
| `GET` | `/api/tracking/{trackingId}`| **Customer-Safe Tracking** | None (Excludes phone, email, internal notes) |

---

## 9. Testing & Quality Verification

### Run Backend Tests (JUnit + Spring Boot Test)
```powershell
cd C:\Users\Mahalakshmi\RepairFlow\backend
.\mvnw.cmd test
```
**Results:** 13/13 tests pass (ticket creation, tracking ID uniqueness, status transitions, public privacy checks, validation, and dashboard stats).

### Run Frontend Production Build
```powershell
cd C:\Users\Mahalakshmi\RepairFlow\frontend
npm run build
```
**Results:** Compiles 1,932+ modules into production assets in `dist/` with 0 errors.

---

## 10. Optional Demonstration Seed Data

To populate sample records (`RF-2026-0003`, `RF-2026-0004`, `RF-2026-0005`) with realistic Indian Rupee amounts:

```powershell
$env:PGPASSWORD="YOUR_POSTGRES_PASSWORD"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d repairflow -f "C:\Users\Mahalakshmi\RepairFlow\seed_data.sql"
```

*The script is idempotent: it uses `WHERE NOT EXISTS` clauses and can be safely re-run without creating duplicates.*

---

## 11. Known Limitations & Production Roadmap

- **Authentication Scope:** In this college project build, the landing page provides separate Customer and Staff entry experiences. The staff dashboard is accessible in direct-demonstration mode. In a commercial production release, Spring Security with JWT tokens in HTTP-only cookies and role-based authorization filters would be added to protect endpoints at the server level.
- **SMS / Email Alerts:** Automated notifications upon status changes (e.g., notifying the customer when status reaches `COMPLETED`) can be integrated via Twilio or JavaMailSender.

---

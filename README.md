# ⚡ SkillSync: Developer Onboarding & Compliance Portal

> **Full-Stack Capstone Project**  
> **Backend:** Java 17+ / Spring Boot 3 / Spring Data JPA / H2 In-Memory Database / Maven  
> **Frontend:** React 18 / Vite / Axios / Modern CSS  

---

## 📌 Project Overview
**SkillSync** is a production-grade enterprise governance and onboarding compliance portal designed to manage, verify, and audit developer readiness across IT business units. When new engineers join an enterprise, they must complete stringent InfoSec, environment provisioning, NDA legal signoffs, and code-review guidelines before acquiring repository write-access.

SkillSync replaces ad-hoc spreadsheets with an automated, auditable compliance tracking system featuring:
- **Role Isolation:** Manager / Auditor supervision across developer cohorts.
- **Dynamic Scoring Engine:** Live recalculation of compliance percentages upon milestone completion.
- **Audit Verification:** Requirement for evidence/proof notes when completing high-risk compliance items.
- **Zero-Friction Setup:** Pre-seeded realistic enterprise profiles (e.g., Cloud, Banking, and Healthcare units).

---

## 🛠️ Tech Stack & Architecture

### Backend (Spring Boot 3)
* **Language & Runtime:** Java 17 / 21 / 27
* **Framework:** Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Bean Validation)
* **Database:** H2 In-Memory Database (`jdbc:h2:mem:skillsyncdb`) with interactive web console
* **Architecture:** Layered Architecture (`Controller` $\rightarrow$ `Service` $\rightarrow$ `Repository` $\rightarrow$ `Entity`)
* **Patterns Used:**
  * **DTO (Data Transfer Object) Pattern:** Prevents Jackson JSON infinite recursion and decouples the database schema from the HTTP contracts.
  * **Transactional Integrity (`@Transactional`):** Ensures atomic updates between task state changes and overall employee compliance scores.
  * **Optimized JPQL Queries:** Eliminates the classic N+1 query problem using `JOIN FETCH` queries.

### Frontend (React 18 + Vite)
* **Framework:** React 18 (Functional Components, Hooks)
* **Tooling:** Vite (Fast build & HMR)
* **HTTP Client:** Axios with centralized interceptors and base URL resolution
* **State Management:** Local React state (`useState`, `useEffect`, `useCallback`) keeping the codebase beginner-friendly without Redux boilerplate.

---

## 📁 Repository Structure

```text
wipro-capstone-project/
├── .gitignore
├── README.md
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/skillsync/
│       │   │   ├── SkillSyncApplication.java
│       │   │   ├── config/              # WebConfig (CORS), DataInitializer (Seeds)
│       │   │   ├── controller/          # REST Controllers
│       │   │   ├── dto/                 # Request & Response DTOs
│       │   │   ├── entity/              # Employee, ComplianceTask, Enums
│       │   │   ├── exception/           # Global Exception Handler & DTOs
│       │   │   ├── repository/         # Spring Data JPA Repositories
│       │   │   └── service/             # Business Logic & Interfaces
│       │   └── resources/
│       │       └── application.properties
│       └── test/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── index.css                    # Professional enterprise theme
        ├── main.jsx
        ├── components/
        │   ├── common/                  # Navbar, StatCard
        │   ├── dashboard/               # MetricGrid, TaskTable
        │   └── tasks/                   # TaskStatusUpdateModal, AssignTaskModal
        ├── pages/
        │   └── ManagerDashboard.jsx
        └── services/
            ├── api.js                   # Axios client instance
            └── taskService.js           # REST service functions
```

---

## 🚀 How to Run Locally

### Prerequisites
1. **Java JDK 17+** (JDK 17, 21, or 27)
2. **Apache Maven 3.8+**
3. **Node.js 18+ and npm** (for the React frontend)
4. **Git** (for version control and GitHub push)

---

### Step 1: Run Spring Boot Backend
Open a terminal in the `backend` folder:

```bash
cd backend
mvn spring-boot:run
```

* Backend server will start at: `http://localhost:8080`
* H2 Web Console: `http://localhost:8080/h2-console`
  * **JDBC URL:** `jdbc:h2:mem:skillsyncdb`
  * **User Name:** `sa`
  * **Password:** `password`

---

### Step 2: Run React Frontend
Open a second terminal in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

* React App will be available at: `http://localhost:3000`
* Open your browser and test:
  * Switching developer profiles from the top navigation.
  * Updating a task status (e.g. marking `IN_PROGRESS` or `COMPLETED` with verification notes).
  * Assigning a new compliance task.
  * Watching the compliance percentage score dynamically recalculate!

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | List all developers with current compliance scores |
| `GET` | `/api/employees/{id}/dashboard` | Aggregated metrics (Total, Completed, Overdue, Score %) |
| `GET` | `/api/tasks/employee/{id}` | All tasks assigned to developer (optional `?status=`) |
| `POST` | `/api/tasks/assign` | Assign a new compliance task to an employee |
| `PATCH`| `/api/tasks/{taskId}/status` | Update task status and append audit verification notes |
| `DELETE`| `/api/tasks/{taskId}` | Remove a task and trigger compliance score recalculation |
| `GET` | `/api/employees/at-risk` | List developers below threshold (default 70%) for escalation |

---

## 🌐 Connecting to GitHub & Deploying
Follow the detailed guide in the terminal or chat response to initialize Git, link your GitHub repository, and deploy to free cloud providers (Render / Railway / Vercel).

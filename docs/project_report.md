# FULLSTACK WEB DEVELOPMENT PROJECT REPORT
**On**
**ClubCompass – BMSCE Club Discovery Platform**

**Submitted by**
Arya Singh (1WA24CS055)
[Student Name 2] (USN)
[Student Name 3] (USN)
[Student Name 4] (USN)

**Under the Guidance of**
[Guide Name]
Assistant Professor

**in partial fulfillment for the award of the degree of**
**BACHELOR OF ENGINEERING**
**in**
**COMPUTER SCIENCE AND ENGINEERING**

**B.M.S. COLLEGE OF ENGINEERING**
(Autonomous Institution under VTU)
BENGALURU-560019
2025 - 2026

---

# CERTIFICATE

This is to certify that the project work entitled **ClubCompass – BMSCE Club Discovery Platform** carried out by **Arya Singh (1WA24CS055)**, **[Student Name 2]**, **[Student Name 3]**, and **[Student Name 4]** who are bonafide students of **B. M. S. College of Engineering**. It is in partial fulfillment for the award of **Bachelor of Engineering in Computer Science and Engineering** of the Visveswaraiah Technological University, Belgaum during the Academic Year 2025-2026. The project report has been approved as it satisfies the academic requirements in respect of **Full Stack Web Development** work prescribed for the said degree.

**Signature of the Guide**
[Guide Name]
Assistant Professor
BMSCE, Bengaluru

**Signature of the HOD**
Dr. [HOD Name]
Prof & Head of Dept of CSE
BMSCE, Bengaluru

**External Viva**
Name of the Examiner: _______________________  Signature with date: _______________________

---

# DECLARATION

We, **Arya Singh (1WA24CS055)**, **[Student Name 2]**, **[Student Name 3]**, and **[Student Name 4]** students of **[Semester]** Semester, B.E, Department of Computer Science and Engineering, BMS College of Engineering, Bangalore, hereby declare that, this Full Stack Web Development entitled **ClubCompass – BMSCE Club Discovery Platform** has been carried out by us under the guidance of **[Guide Name]**, Assistant Professor, Department of CSE, B.M.S College of Engineering, Bangalore during the academic semester.

We also declare that to the best of our knowledge and belief, the development reported here is not from part of any other report by any other students.

**[Student Name 1]**
**[Student Name 2]**
**[Student Name 3]**
**[Student Name 4]**

Signature: _______________________

---

# TABLE OF CONTENTS

| Sl. No. | TITLE | PG NO. |
| :--- | :--- | :--- |
| **1** | **Introduction** | **1** |
| 1.1 | Overview | 1 |
| 1.2 | Motivation | 1 |
| **2** | **Software Requirement Specification** | **3** |
| 2.1 | Hardware Requirements | 3 |
| 2.2 | Software Requirements | 3 |
| **3** | **ER Diagram of the project** | **4** |
| **4** | **Schema of project** | **5** |
| **5** | **User Interface Design** | **6** |
| **6** | **References** | **10** |
| **7** | **Core Concepts Used** | **11** |

---

# 1: INTRODUCTION

## 1.1 Overview

ClubCompass is a centralized digital platform tailored for B.M.S. College of Engineering to bridge the gap between students and the diverse ecosystem of campus clubs. It serves as a "smart compass" for navigating student life, allowing users to discover technical, cultural, and departmental clubs, view upcoming announcements, and find communities that align with their personal interests.

The system features an AI-assisted assessment tool that recommends clubs based on a student's personality and goals, a unified event feed to replace scattered WhatsApp notices, and administrative tools for club coordinators to manage their digital presence. By consolidating information into a single, modern web application, ClubCompass aims to boost student engagement and ensure no student misses out on opportunities due to lack of information.

## 1.2 Motivation

**The Problem We Observed**
Despite having a vibrant campus culture with numerous active clubs, students—especially freshers—face significant challenges:
1.  **Information Overload & Fragmentation:** Club recruitment drives, event details, and workshop schedules are scattered across disparate WhatsApp groups, Instagram pages, and physical notice boards.
2.  **Discovery Issues:** Students are often unaware of niche clubs (like aerospace, robotics, or literature) that match their specific interests until late in their college journey.
3.  **Lack of Centralization:** There is no single "directory" where a student can view all active clubs, their current leadership, or their past achievements.
4.  **Static Interaction:** Traditional methods of joining clubs involve manual forms or physical sign-ups, which are inefficient and prone to data loss.

**Our Inspiration**
We were inspired by the organized structure of professional networking platforms like LinkedIn and the personalized discovery of streaming services like Spotify. We wanted to bring that level of polished, user-centric experience to the campus environment. Observing how major college fests (like Phase Shift or Utsav) struggle with unified communication further motivated us to build a scalable solution.

**Why This Matters**
Extracurricular involvement is crucial for holistic engineering education. It fosters leadership, teamwork, and technical skills that classroom learning cannot provide alone. When students fail to connect with the right peer groups, they miss out on these critical growth opportunities. ClubCompass ensures that every student has equal access to information and opportunity.

**Our Solution**
ClubCompass provides a comprehensive solution:
*   **For Students:** A searchable directory of all clubs, a "Smart Assessment" quiz for personalized recommendations, and a centralized dashboard for favorites and announcements.
*   **For Clubs:** A dedicated profile management system to showcase logos, social links, and galleries, ensuring their brand is consistent and accessible.
*   **For Admin:** A dashboard to oversee club activities, approve new club formations, and view platform-wide analytics.

---

# 2: SOFTWARE REQUIREMENTS

## 2.1 Hardware Requirements:
The system is containerized using Docker, ensuring consistent performance across development and production environments.

**For Developers (Local Machine):**
*   **Processor:** Intel Core i5 (8th gen+) or AMD Ryzen 5 equivalent.
*   **RAM:** 8 GB minimum (16 GB recommended for running Docker containers smoothly).
*   **Storage:** 512 GB SSD (approx. 10 GB required for container images and database volumes).
*   **Network:** Active internet connection for fetching dependencies.

**For Production Server (GCP/AWS):**
*   **Instance:** e2-micro (GCP Free Tier) or t3.micro (AWS).
*   **vCPU:** 2 vCPUs.
*   **RAM:** 4 GB - 8 GB (Recommended for handling concurrent database connections and Next.js server-side rendering).
*   **Storage:** 20 GB+ Persistent Disk.

## 2.2 Software Requirements:
**(Confidence Score: 98/100)**
The project follows a modern Microservices-ready Monolithic architecture.

**Operating System:**
*   **Development:** Windows 10/11 (via WSL2), macOS, or Linux (Ubuntu 22.04 LTS).
*   **Server:** Linux (Alpine based Docker images).

**Backend (API & Data):**
*   **Language:** Python 3.11+
*   **Framework:** FastAPI (High-performance async framework).
*   **Database:** PostgreSQL 15 (Relational Data), Redis 7 (Caching & Session management).
*   **ORM:** SQLAlchemy (Database interaction).
*   **Authentication:** OAuth2 with JWT (JSON Web Tokens).

**Frontend (Client):**
*   **Framework:** Next.js 14+ (React 18) with App Router.
*   **Language:** TypeScript (Strict type safety).
*   **Styling:** Tailwind CSS (Utility-first CSS) with Shadcn/UI components.
*   **State Management:** Zustand.
*   **Runtime:** Node.js 20+ (Alpine).

**Tools & DevOps:**
*   **Containerization:** Docker & Docker Compose.
*   **Version Control:** Git & GitHub.
*   **API Testing:** Postman / Swagger UI.
*   **Editor:** VS Code with Pylance and ESLint extensions.

---

# 3: ER DIAGRAM OF THE PROJECT

*Note: In the actual report, this section would contain the visual Entity-Relationship Diagram. Below is the description of the entities and relationships depicted.*

The ER Diagram for ClubCompass is centered around the **User** and **Club** entities.

1.  **User Entity:** The central actor. Attributes include `id`, `email`, `password_hash`, `role` (student/admin), and `full_name`.
2.  **Club Entity:** Represents the organizations. Attributes include `id`, `name`, `category` (Technical, Cultural, etc.), `logo_url`, and `contact_info`.
3.  **Membership (Join Table):** Connects Users and Clubs. It has a Many-to-Many relationship resolved into two One-to-Many relationships. Attributes: `user_id`, `club_id`, `role` (member/lead), `status` (active/pending).
4.  **Assessment & Recommendations:**
    *   **Assessment:** Stores user quiz data (`user_id`, `responses_json`).
    *   **Recommendation:** Links an Assessment to recommended Clubs (`assessment_id`, `club_id`, `match_score`).
5.  **Announcements:** A Club can have multiple Announcements (One-to-Many). Attributes: `club_id`, `title`, `content`, `date`.
6.  **User Reports:** Users can report other entities. Links `reporter_id` to `reported_user_id` or `reported_club_id`.
7.  **Favorites:** A simple Many-to-Many link between User and Club for bookmarking (`user_id`, `club_id`).

---

# 4: SCHEMA OF THE PROJECT

### 4.1 Users Table
| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Unique | Unique identifier for the user |
| `email` | VARCHAR(255) | Unique, Not Null | Institutional email address |
| `password_hash` | VARCHAR(255) | Not Null | Bcrypt hashed password |
| `full_name` | VARCHAR(255) | Not Null | User's display name |
| `is_admin` | BOOLEAN | Default False | Superuser status flag |
| `preferences` | JSONB | Nullable | Stored user interests/settings |

### 4.2 Clubs Table
| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Unique | Unique identifier for the club |
| `name` | VARCHAR(255) | Unique, Not Null | Official club name |
| `slug` | VARCHAR(255) | Unique, Not Null | URL-friendly name |
| `category` | ENUM | Not Null | Technical, Cultural, etc. |
| `subcategory` | VARCHAR(100) | Nullable | E.g., Coding, Dance, Robotics |
| `member_count` | INTEGER | Default 0 | Cached count of active members |
| `approval_status` | ENUM | Default 'approved' | Pending/Approved/Rejected |

### 4.3 Memberships Table
| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique record ID |
| `user_id` | UUID | FK (Users) | Reference to the student |
| `club_id` | UUID | FK (Clubs) | Reference to the club |
| `role` | VARCHAR(50) | Default 'member' | Role within the club |
| `joined_at` | DATETIME | Not Null | Timestamp of joining |

### 4.4 Assessments Table
| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique assessment ID |
| `user_id` | UUID | FK (Users) | User who took the quiz |
| `responses` | JSON | Not Null | Full quiz answer payload |
| `created_at` | DATETIME | Not Null | Date of assessment |

### 4.5 Announcements Table
| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique announcement ID |
| `club_id` | UUID | FK (Clubs) | Publisher club |
| `title` | VARCHAR(255) | Not Null | Headline |
| `content` | TEXT | Not Null | Markdown/Text content |
| `is_published` | BOOLEAN | Default True | Visibility status |

---

# 5: USER INTERFACE DESIGN

### 5.1 Landing Page
The entry point of the application featuring a hero section with the "Find Your Community" call-to-action. It displays featured clubs (fetched via `get_featured_clubs` API) and a search bar for quick navigation.

### 5.2 Authentication (Login/Register)
Secure pages utilizing JWT authentication.
*   **Register:** Form validating BMSCE email domain formats.
*   **Login:** Standard credential entry with error handling.
*   **Forgot Password:** Workflow triggering email-based reset tokens.

### 5.3 Club Discovery Page
A grid-layout catalogue of all active clubs.
*   **Filters:** Sidebar filters for Categories (Tech/Non-Tech) and Subcategories.
*   **Search:** Real-time text search using PostgreSQL Full-Text Search.
*   **Cards:** Each club is displayed as a card showing its logo, category tag, and member count.

### 5.4 Smart Assessment Interface
An interactive, step-by-step quiz interface.
*   **Progress:** Displays a progress bar as users answer questions about their interests (e.g., "Do you prefer coding or public speaking?").
*   **Results:** A dynamic results page showing "Top Recommended Clubs" with a percentage match score based on the algorithm.

### 5.5 Club Detail Page
A dedicated profile page for each club.
*   **Header:** Cover image and club logo.
*   **Tabs:** Sections for "Overview", "Announcements", and "Gallery" (Instagram integration).
*   **Action Button:** A dynamic "Join Club" or "Leave Club" button depending on membership status.

### 5.6 User Dashboard / Profile
A personalized space for the student.
*   **My Clubs:** List of clubs the user has joined.
*   **Favorites:** Bookmarked clubs for quick access.
*   **Settings:** Options to update profile details or change password.

### 5.7 Admin Dashboard
Restricted area for platform administrators.
*   **Stats:** Cards showing Total Users, Active Clubs, and New Registrations.
*   **Moderation:** A list of new club requests pending approval (`approval_status=PENDING`).
*   **User Management:** Table to view and manage user accounts/roles.

---

# 6: REFERENCES

1.  **FastAPI Documentation:** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/) - Used for designing the RESTful API architecture and dependency injection patterns.
2.  **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs) - Referenced for App Router structure, Server Components, and data fetching strategies.
3.  **SQLAlchemy ORM:** [https://docs.sqlalchemy.org/en/20/](https://docs.sqlalchemy.org/en/20/) - Used for defining database models and managing relationships between Users and Clubs.
4.  **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs) - utilized for rapid, responsive UI development.
5.  **Docker Documentation:** [https://docs.docker.com/](https://docs.docker.com/) - Referenced for containerizing the application services and writing `docker-compose.yml`.
6.  **BMSCE College Website:** [https://bmsce.ac.in/](https://bmsce.ac.in/) - Referenced for domain validation rules and academic department structures.

---

# 7: CORE CONCEPTS USED

### 7.1 Frontend (Next.js & React)
*   **Components & Props:** [https://react.dev/learn/passing-props-to-a-component](https://react.dev/learn/passing-props-to-a-component) - Building reusable UI blocks and passing data between them.
*   **State & Lifecycle:** [https://react.dev/learn/state-a-components-memory](https://react.dev/learn/state-a-components-memory) - Managing internal component data and side effects (using `useState` and `useEffect`).
*   **Handling Events:** [https://react.dev/learn/responding-to-events](https://react.dev/learn/responding-to-events) - Interacting with user inputs like clicks and form submissions.
*   **Conditional Rendering:** [https://react.dev/learn/conditional-rendering](https://react.dev/learn/conditional-rendering) - Displaying different UI elements based on logic (e.g., show login button if logged out).
*   **Lists & Keys:** [https://react.dev/learn/rendering-lists](https://react.dev/learn/rendering-lists) - Efficiently rendering arrays of data (like club cards) using unique identifiers.
*   **Forms:** [https://react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components) - Managing user input through controlled components and validation.
*   **Lifting State Up:** [https://react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components) - Moving state to a common ancestor to share data between sibling components.
*   **Context API:** [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context) - Managing global state (like User Auth status) accessible throughout the component tree.
*   **App Router & Layouts:** [https://nextjs.org/docs/app](https://nextjs.org/docs/app) - Used for file-system based routing and shared UI (Layouts) across pages.
*   **Server vs. Client Components:** [https://nextjs.org/docs/getting-started/react-essentials](https://nextjs.org/docs/getting-started/react-essentials) - Distinguishing between components rendered on the server (for performance) and interactive client-side components.
*   **Data Fetching:** [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching) - Fetching data asynchronously on the server and passing it to components.
*   **Middleware:** [https://nextjs.org/docs/app/building-your-application/routing/middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) - Intercepting requests for authentication checks before rendering pages.

### 7.2 Backend (FastAPI & Python)
*   **Path Operations:** [https://fastapi.tiangolo.com/tutorial/first-steps/](https://fastapi.tiangolo.com/tutorial/first-steps/) - Defining API endpoints (GET, POST, etc.) to handle specific client requests.
*   **Pydantic Models:** [https://docs.pydantic.dev/latest/](https://docs.pydantic.dev/latest/) - Used for data validation, serialization, and defining strict schemas for request/response bodies.
*   **Dependency Injection:** [https://fastapi.tiangolo.com/tutorial/dependencies/](https://fastapi.tiangolo.com/tutorial/dependencies/) - Managing database sessions (`get_db`) and authentication tokens (`get_current_user`) modularly.
*   **ORM (Object Relational Mapping):** [https://docs.sqlalchemy.org/](https://docs.sqlalchemy.org/) - Mapping Python classes (`User`, `Club`) to database tables for safe and easy data manipulation.
*   **Async/Await:** [https://docs.python.org/3/library/asyncio.html](https://docs.python.org/3/library/asyncio.html) - Writing non-blocking code to handle multiple concurrent requests efficiently.

### 7.3 Infrastructure (Docker)
*   **Containerization:** [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/) - Packaging the application with all its dependencies into standardized units (containers).
*   **Orchestration (Compose):** [https://docs.docker.com/compose/](https://docs.docker.com/compose/) - Defining and running multi-container applications (Frontend + Backend + Database) with a single command.

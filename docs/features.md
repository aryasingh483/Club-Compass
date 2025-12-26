# Backend Features & API Documentation

## Executive Summary: Feature Overview
This section highlights the core capabilities of the ClubCompass platform, designed to simplify club discovery and management for students and administrators.

### 1. Student Access & Security
*   **What it does:** Allows students to securely sign up and log in using their official college email addresses.
*   **Use Case:** Ensures only verified students can access the platform, keeping the community safe and exclusive to the college. Includes password recovery and profile management.

### 2. Club Discovery & Exploration
*   **What it does:** Provides a central directory where students can browse all available clubs, search by name, or filter by categories (like technical, cultural, or sports).
*   **Use Case:** Helps students quickly find clubs that match their interests without needing to know the exact club name beforehand.

### 3. Smart Club Recommendations
*   **What it does:** A personalized "quiz" that asks students about their interests and time availability, then suggests the best-fitting clubs.
*   **Use Case:** Solves the "choice overload" problem for new students who don't know where to start, guiding them to clubs they are most likely to enjoy.

### 4. Interactive Club Pages
*   **What it does:** Each club has a dedicated page displaying its logo, description, latest announcements, and a photo gallery (integrated with Instagram).
*   **Use Case:** Gives clubs a digital presence to showcase their activities and attract new members. Students can stay updated on club events and news.

### 5. Membership Management
*   **What it does:** Enables students to join or leave clubs with a simple click.
*   **Use Case:** Streamlines the recruitment process. Students can easily manage their memberships, and clubs can track their member base.

### 6. Favorites & Bookmarking
*   **What it does:** Lets students save specific clubs to a personal "Favorites" list.
*   **Use Case:** Allows students to keep track of clubs they are interested in but might not be ready to join yet, or to quickly access their top clubs.

### 7. Community Safety & Reporting
*   **What it does:** A confidential channel for users to report inappropriate content, behavior, or clubs to platform administrators.
*   **Use Case:** Maintains a safe and respectful environment by allowing rapid flagging of issues for administrative review.

### 8. Administrator Dashboard
*   **What it does:** A powerful control center for college staff to oversee the entire platform. Includes statistics on usage, tools to manage users and clubs, and content moderation features.
*   **Use Case:** Gives the college full control over the platform, allowing them to promote specific clubs, handle reports, and ensure the system is running smoothly.

---

This document provides a comprehensive overview of the backend features and their corresponding API endpoints for the ClubCompass platform.

## 1. Authentication & User Management
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/auth.py`, `backend/app/api/v1/users.py`

Handles user registration, login, token management, and profile updates. It uses JWT for secure authentication and includes BMSCE email validation.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/v1/auth/register` | Register a new user with BMSCE email. | Public |
| `POST` | `/api/v1/auth/login` | Login with email and password. | Public |
| `POST` | `/api/v1/auth/refresh` | Refresh access token using refresh token. | Public |
| `GET` | `/api/v1/auth/me` | Get current user profile (Auth context). | Authenticated |
| `POST` | `/api/v1/auth/password-reset/request` | Request password reset email. | Public |
| `POST` | `/api/v1/auth/password-reset/confirm` | Reset password using token. | Public |
| `POST` | `/api/v1/auth/email/send-verification` | Send verification email. | Authenticated |
| `POST` | `/api/v1/auth/email/verify` | Verify email using token. | Public |
| `GET` | `/api/v1/users/me` | Get current user profile (User context). | Authenticated |
| `PATCH` | `/api/v1/users/me` | Update user profile. | Authenticated |
| `GET` | `/api/v1/users/me/memberships` | Get current user's club memberships. | Authenticated |

### Example Usage
**Login:**
```json
POST /api/v1/auth/login
{
  "email": "student@bmsce.ac.in",
  "password": "StrongPassword123!"
}
```

---

## 2. Club Management
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/clubs.py`

Core functionality for listing, searching, and viewing club details. Includes admin features for creating and managing clubs.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/v1/clubs/` | Get all clubs with optional filtering & search. | Public |
| `GET` | `/api/v1/clubs/featured` | Get featured clubs. | Public |
| `GET` | `/api/v1/clubs/popular` | Get popular clubs by member count. | Public |
| `GET` | `/api/v1/clubs/{slug}` | Get club details by slug. | Public |
| `POST` | `/api/v1/clubs/` | Create a new club. | Admin |
| `PATCH` | `/api/v1/clubs/{club_id}` | Update a club. | Admin |
| `DELETE` | `/api/v1/clubs/{club_id}` | Delete a club. | Admin |

### Example Usage
**Get Club by Slug:**
```http
GET /api/v1/clubs/acm-student-chapter
```

---

## 3. Club Interactive Features (Membership, Announcements, Gallery)
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/clubs.py`

Features that allow users to interact with clubs, including joining/leaving, viewing announcements, and checking the gallery.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/v1/clubs/{club_id}/join` | Join a club. | Authenticated |
| `DELETE` | `/api/v1/clubs/{club_id}/leave` | Leave a club. | Authenticated |
| `GET` | `/api/v1/clubs/{club_id}/announcements` | Get announcements for a club. | Public |
| `POST` | `/api/v1/clubs/{club_id}/announcements` | Create a new announcement. | Admin |
| `PATCH` | `/api/v1/clubs/announcements/{id}` | Update an announcement. | Admin |
| `DELETE` | `/api/v1/clubs/announcements/{id}` | Delete an announcement. | Admin |
| `GET` | `/api/v1/clubs/{club_id}/gallery` | Get gallery settings/posts. | Public |
| `POST` | `/api/v1/clubs/{club_id}/gallery` | Update gallery settings. | Admin |
| `POST` | `/api/v1/clubs/{club_id}/gallery/refresh`| Refresh Instagram gallery cache. | Admin |

---

## 4. Assessment & Recommendations
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/assessment.py`

AI-driven or logic-based assessment system to recommend clubs to users based on their interests and personality.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/v1/assessments/` | Submit assessment and get recommendations. | Public/Auth |
| `GET` | `/api/v1/assessments/{assessment_id}` | Get assessment results by ID. | Public |
| `GET` | `/api/v1/assessments/user/{user_id}` | Get all assessments for a user. | Authenticated |

### Example Usage
**Submit Assessment:**
```json
POST /api/v1/assessments/
{
  "responses": {
    "interests": ["tech", "coding"],
    "time_commitment": "medium"
  }
}
```

---

## 5. Favorites
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/favorites.py`

Allows users to bookmark/favorite clubs for quick access.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/v1/favorites/` | Get current user's favorited clubs. | Authenticated |
| `POST` | `/api/v1/favorites/` | Add a club to favorites. | Authenticated |
| `DELETE` | `/api/v1/favorites/{club_id}` | Remove a club from favorites. | Authenticated |
| `GET` | `/api/v1/favorites/check/{club_id}` | Check if a club is favorited. | Authenticated |

---

## 6. Reporting System
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/reports.py`

Mechanism for users to report inappropriate behavior, content, or clubs. Includes admin moderation tools.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/v1/reports/` | Create a new report. | Authenticated |
| `GET` | `/api/v1/reports/` | Get list of all reports. | Admin |
| `GET` | `/api/v1/reports/{report_id}` | Get report details. | Admin |
| `PATCH` | `/api/v1/reports/{report_id}` | Update report status/notes. | Admin |
| `DELETE` | `/api/v1/reports/{report_id}` | Delete a report. | Admin |
| `GET` | `/api/v1/reports/stats/summary` | Get report statistics. | Admin |

---

## 7. Admin Dashboard & Operations
**Confidence Score:** 10/10  
**Source:** `backend/app/api/v1/admin.py`

Comprehensive admin suite for platform management, statistics, user/club oversight, and content moderation.

### Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/v1/admin/dashboard/stats` | Get dashboard statistics. | Admin |
| `GET` | `/api/v1/admin/users` | List all users. | Admin |
| `GET` | `/api/v1/admin/users/{user_id}` | Get user details. | Admin |
| `PATCH` | `/api/v1/admin/users/{user_id}/role` | Update user role (promote/demote). | Admin |
| `PATCH` | `/api/v1/admin/users/{user_id}/status` | Activate/deactivate user. | Admin |
| `GET` | `/api/v1/admin/clubs` | List all clubs (including inactive). | Admin |
| `PATCH` | `/api/v1/admin/clubs/{club_id}/featured`| Toggle club featured status. | Admin |
| `PATCH` | `/api/v1/admin/clubs/{club_id}/active` | Activate/deactivate club. | Admin |
| `DELETE` | `/api/v1/admin/clubs/{club_id}` | Delete club (Admin override). | Admin |
| `GET` | `/api/v1/admin/activity` | Get recent platform activity. | Admin |
| `POST` | `/api/v1/admin/clubs/bulk-import` | Bulk import clubs from CSV. | Admin |

### Moderation Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/v1/admin/moderation/pending-clubs`| Get clubs pending approval. | Admin |
| `PATCH` | `/api/v1/admin/moderation/clubs/{id}/approve` | Approve a pending club. | Admin |
| `PATCH` | `/api/v1/admin/moderation/clubs/{id}/reject` | Reject a pending club. | Admin |
| `PATCH` | `/api/v1/admin/moderation/clubs/{id}/request-revision` | Request revisions. | Admin |
| `GET` | `/api/v1/admin/moderation/stats` | Get moderation statistics. | Admin |
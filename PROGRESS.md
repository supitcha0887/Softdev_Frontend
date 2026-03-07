# Project Status Overview (Report Application) - Updated 2026-03-07

This summary provides a comprehensive overview of the current state of the Report Application project's frontend, reflecting the latest architecture and feature set. The project has matured significantly from mock data to a live, dual-backend architecture.

---

## 1. Core Architecture

The frontend employs a sophisticated hybrid architecture:

- **React Framework (Vite):** Serves as the foundation for the user interface.
- **Supabase (Identity & Storage):**
  - **Identity Provider:** Manages all user authentication (login, registration, session management).
  - **Database:** Stores user profile data (`users` table with `full_name`, etc.).
  - **Storage:** Manages file uploads, specifically for report images (`report-images` bucket).
- **ASP.NET Core (Business Logic API):**
  - **Resource Server:** Acts as the primary backend for core application logic.
  - **Authorization:** Handles role-based access control by verifying Supabase JWTs and determining if a user is an admin.
  - **Data Endpoints:** Provides all data for the admin dashboard, report creation, and progress updates.

---

## 2. Authentication & Routing Flow

The application's security and navigation are handled in a clear, two-step process:

1.  **Authentication (Supabase):** The user signs in via the `Login.jsx` page, which calls `supabase.auth.signInWithPassword`.
2.  **Authorization (ASP.NET API):**
    - Upon successful login, the Supabase JWT (`access_token`) is retrieved and stored in `localStorage`.
    - A request is immediately sent to the `/Auth/me` endpoint on the ASP.NET backend, with the JWT as a Bearer token.
    - The backend responds with the user's role (e.g., `{ "isAdmin": true }`).
3.  **Role-Based Redirect:** The frontend uses the response from `/Auth/me` to navigate the user to the appropriate section: `/dashboard` for admins, `/home` for standard users.

### Routing Table (`App.jsx`)

| Path                          | Component          | Protection                                 | Description                                        |
| ----------------------------- | ------------------ | ------------------------------------------ | -------------------------------------------------- |
| `/`                           | `Login`            | Public                                     | Login screen.                                      |
| `/register`                   | `Register`         | Public                                     | Registration screen.                               |
| `/home`                       | `Report`           | Authenticated (via Supabase session)       | User landing/welcome page.                         |
| `/report`                     | `ReportPage`       | Authenticated                              | The primary form for submitting a new repair report. |
| `/my-reports`                 | `MyReports`        | Authenticated                              | A list of the user's own submitted reports.        |
| **(Admin Routes)**            |                    | **Admin Only (via `Layout.jsx`)**          | All routes below require admin privileges.         |
| `/dashboard`                  | `AdminDashboard`   | Admin                                      | Admin overview with statistics and charts.         |
| `/requests`                   | `ManageRequests`   | Admin                                      | Full list of all repair requests.                  |
| `/requests/:id`               | `RequestDetail`    | Admin                                      | Detailed view of a single repair request.          |
| `/requests/:id/update-progress` | `UpdateProgress`   | Admin                                      | Form to update progress, add notes, and change status. |
| `/requests/:id/cost-logging`  | `CostLogging`      | Admin                                      | Form for logging costs associated with a repair.   |
| `/requests/:id/close-job`     | `CloseJob`         | Admin                                      | Final summary and job closure page.                |

---

## 3. Feature Analysis & Data Sources

### ✅ **User-Facing Features (Live)**

- **Report Submission (`ReportPage.jsx`):**
  - **Data Source:** Fetches `locations`, `asset_categories`, and `assets` from **Supabase** to populate cascading dropdowns.
  - **Image Handling:** Utilizes `imageUtils.js` to perform client-side image compression and validation before uploading the file to **Supabase Storage**.
  - **Submission:** Submits the final report data to the **ASP.NET API** (`/Report/Create`).
- **User Navigation (`UserNavbar.jsx`):**
  - Fetches user's `full_name` from the **Supabase** `users` table.
  - Fetches the unread notification count from the **ASP.NET API** (`/Notification/UnreadCount`).
- **My Reports (`MyReports.jsx`):**
  - Displays a list of reports submitted by the logged-in user. *(Data source assumed to be ASP.NET API)*.

### ✅ **Admin-Facing Features (Live)**

- **Admin Dashboard (`AdminDashboard.jsx`):**
  - **Data Source:** All data is fetched live from the **ASP.NET API** (`/admin/dashboard/reports`). The `mock.js` file is **no longer in use** for this page.
  - **Visualizations:** Employs `recharts` to display three distinct, responsive charts: Reports by Location (Bar), Status Overview (Donut), and Monthly Volume (Bar).
- **Repair Workflow (`UpdateProgress.jsx`, etc.):**
  - **Data Source:** Fetches detailed report data and history from the **ASP.NET API** (e.g., `/AdminManage/repair-requests/:id`).
  - **Updates:** Submits status changes, work notes, checklists, and cancellation reasons back to the **ASP.NET API** via `POST` and `PATCH` requests.

### 🛠️ **Utility Features**

- **Image Compression (`imageUtils.js`):**
  - Exports `compressImage` and `formatFileSize`.
  - `compressImage` resizes images to a max dimension of 1920px and converts them to `image/jpeg` with a specified quality, significantly reducing upload size and time. This is used in both the user's report submission and the admin's progress update.

---

## 4. Key Dependencies

- `react`: ^19.2.0
- `react-router-dom`: ^7.13.0
- `@supabase/supabase-js`: ^2.97.0
- `recharts`: ^3.7.0 (for admin charts
- `vite`: ^7.3.1

---

## 5. Project Status Summary

#### ✅ **Completed & Live**

-   **Dual-Backend Architecture:** The core architecture combining Supabase (Auth/Storage) and a separate ASP.NET API (Logic/Data) is fully implemented and operational.
-   **Full Authentication Flow:** User login, registration, session management, and role-based routing are complete.
-   **User Reporting Workflow:** The entire flow for a user to create and submit a detailed repair request is functional, including cascading selects and image compression/upload.
-   **Admin Dashboard:** A data-rich, live dashboard provides admins with key statistics and visualizations.
-   **Admin Management Workflow:** The end-to-end process for an admin to view, accept, update, and manage a repair request is implemented and connected to the backend API.
-   **Manage Requests Page:** The `ManageRequests` page is fully migrated to use the ASP.NET API for data fetching and management, no longer relying on `mock.js`.

#### 🔄 **In Progress / TODO**

-   **Complete API Migration:** Verify that all admin pages (`RequestDetail`, `CostLogging`, `CloseJob`) are fully migrated from `mock.js` to the ASP.NET API, following the pattern set by `AdminDashboard` and `UpdateProgress`.
-   **Real-time Notifications:** The current notification system relies on fetching counts on load. A future improvement could involve real-time updates using Supabase Realtime or WebSockets.
-   **Admin User/Asset Management:** UI/API for direct management of users and assets (inventory) are not yet implemented.
-   **Error Handling & Edge Cases:** Continue to refine user-facing error messages and handle potential API/network failure scenarios gracefully across the application.

---
_This document reflects the state of the `Softdev_Frontend` directory as of March 7, 2026. The `mock.js` file, while still present, should be considered deprecated for primary admin functionality and likely serves as a development fallback or for minor components._

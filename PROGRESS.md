# สรุปความคืบหน้าการพัฒนา Frontend (Branch: Naphat)
 
 ## ไฟล์ที่สร้าง/แก้ไขทั้งหมด
 
 ### สร้างใหม่
 - [`Softdev_Frontend/src/pages/user/MyReports.jsx`](Softdev_Frontend/src/pages/user/MyReports.jsx)
 - [`Softdev_Frontend/src/pages/user/MyReports.module.css`](Softdev_Frontend/src/pages/user/MyReports.module.css)
 - [`Softdev_Frontend/src/components/NotificationPopup.jsx`](Softdev_Frontend/src/components/NotificationPopup.jsx)
 - [`Softdev_Frontend/src/components/NotificationPopup.module.css`](Softdev_Frontend/src/components/NotificationPopup.module.css)
 - [`Softdev_Frontend/data/mock.js`](Softdev_Frontend/data/mock.js) (มีการเพิ่มและแก้ไขโครงสร้างข้อมูลจำลองทั้งหมด)
 - [`Softdev_Frontend/vite.config.js`](Softdev_Frontend/vite.config.js) (สำหรับ proxy config)
 - [`Softdev_Frontend/public/favicon.png`](Softdev_Frontend/public/favicon.png) (สร้างใหม่)
 - [`Softdev_Frontend/public/Icon.png`](Softdev_Frontend/public/Icon.png) (คัดลอก)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.jsx`](Softdev_Frontend/src/pages/admin/UpdateProgress.jsx) (สร้างใหม่)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.module.css`](Softdev_Frontend/src/pages/admin/UpdateProgress.module.css) (สร้างใหม่)
 - [`Softdev_Frontend/src/pages/admin/CostLogging.jsx`](Softdev_Frontend/src/pages/admin/CostLogging.jsx) (สร้างใหม่: ระบบบันทึกค่าใช้จ่าย)
 - [`Softdev_Frontend/src/pages/admin/CostLogging.module.css`](Softdev_Frontend/src/pages/admin/CostLogging.module.css) (สร้างใหม่)
 - [`Softdev_Frontend/src/pages/admin/CloseJob.jsx`](Softdev_Frontend/src/pages/admin/CloseJob.jsx) (สร้างใหม่: หน้าสรุปและปิดงานซ่อม)
 - [`Softdev_Frontend/src/pages/admin/CloseJob.module.css`](Softdev_Frontend/src/pages/admin/CloseJob.module.css) (สร้างใหม่)
 - [`Softdev_Frontend/src/components/Navbar.module.css`](Softdev_Frontend/src/components/Navbar.module.css) (สร้างใหม่)
 - [`Softdev_Frontend/src/components/NotificationCenter.module.css`](Softdev_Frontend/src/components/NotificationCenter.module.css) (สร้างใหม่)
 
 ### แก้ไข
 - [`Softdev_Frontend/index.html`](Softdev_Frontend/index.html):
     - เปลี่ยน `<title>` เป็น "Report Application"
     - เปลี่ยน favicon ให้ชี้ไปที่ `/favicon.png`
 - [`Softdev_Frontend/src/App.jsx`](Softdev_Frontend/src/App.jsx):
     - เพิ่ม route สำหรับหน้า MyReports
     - เพิ่ม route สำหรับหน้า `/requests/:id/update-progress`
     - เพิ่ม route สำหรับหน้า `/requests/:id/cost-logging`
     - เพิ่ม route สำหรับหน้า `/requests/:id/close-job`
 - [`Softdev_Frontend/src/components/RepairCard.jsx`](Softdev_Frontend/src/components/RepairCard.jsx): เพิ่มสถานะ `cancelled` และอัปเดต `statusMap`
 - [`Softdev_Frontend/src/components/RepairCard.module.css`](Softdev_Frontend/src/components/RepairCard.module.css): เพิ่ม style สำหรับสถานะ `cancelled`
 - [`Softdev_Frontend/src/components/UserNavbar.jsx`](Softdev_Frontend/src/components/UserNavbar.jsx):
     - อัปเดตลิงก์ \'List\' ให้ชี้ไปที่ `/my-reports`
     - เพิ่ม logic สำหรับแสดง NotificationPopup
     - จัดการ state `showNotifications` และ `unreadCount`
     - ดึง `full_name` จาก Supabase `users` table
     - ลบ `currentUserId`
 - [`Softdev_Frontend/src/components/UserNavbar.module.css`](Softdev_Frontend/src/components/UserNavbar.module.css): เพิ่ม style สำหรับ `notificationBadge` (unread count)
 - [`Softdev_Frontend/src/pages/user/MyReports.module.css`](Softdev_Frontend/src/pages/user/MyReports.module.css): ปรับขนาด font size สำหรับหัวข้อส่วน (section titles) เป็น `24px`
 - [`Softdev_Frontend/src/pages/user/Login.jsx`](Softdev_Frontend/src/pages/user/Login.jsx):
     - แก้ logic การ login ให้รองรับ Backend Auth (GET /Auth/me)
     - ดึง `access_token` จาก session และเก็บใน `localStorage` key "token"
     - นำทางตาม `response.isAdmin` (`/dashboard` หรือ `/home`)
     - เปลี่ยนจาก `axios` มาใช้ `fetch`
     - ลบ `/api/` นำหน้า endpoint
 - [`Softdev_Frontend/src/pages/admin/AdminDashboard.jsx`](Softdev_Frontend/src/pages/admin/AdminDashboard.jsx):
     - เปลี่ยนการ import และการใช้งาน `requests` เป็น `reports`
     - เพิ่มกราฟสถิติการแจ้งซ่อมแบ่งตามสถานที่ (Bar Chart)
     - เพิ่มกราฟสัดส่วนสถานะงาน (Donut Chart)
     - เพิ่มกราฟจำนวนแจ้งซ่อมรายเดือน (Bar Chart)
     - จัด Layout กราฟเป็น 3 คอลัมน์แบบ Responsive
 - [`Softdev_Frontend/src/pages/admin/ManageRequests.jsx`](Softdev_Frontend/src/pages/admin/ManageRequests.jsx): เปลี่ยนการ import และการใช้งาน `requests` เป็น `reports`
 - [`Softdev_Frontend/src/pages/admin/RequestDetail.jsx`](Softdev_Frontend/src/pages/admin/RequestDetail.jsx):
     - เปลี่ยนการ import และการใช้งาน `requests` เป็น `reports`
     - เพิ่มปุ่มนำทางไปยังหน้าอัปเดตความคืบหน้าการซ่อม (`UpdateProgress`)
     - เพิ่มปุ่มนำทางไปยังหน้าบันทึกค่าใช้จ่าย (`CostLogging`)
     - เพิ่มปุ่มนำทางไปยังหน้าปิดงานซ่อม (`CloseJob`)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.jsx`](Softdev_Frontend/src/pages/admin/UpdateProgress.jsx):
     - ปรับปรุงการแสดงผล dropdown สถานะงานให้มีตัวเลือกที่แน่นอนและเป็นภาษาไทย
     - ปรับปรุงการแสดงผล checklist item ให้มีระยะห่างที่ถูกต้อง
     - เพิ่มระบบอัปโหลดรูปภาพพร้อม preview สำหรับรูปภาพหลังการซ่อม
     - ปรับปรุง Header section ให้ใช้ style เดียวกับหน้า Admin อื่นๆ (background image และ text color)
     - เพิ่มปุ่มนำทางไปยังหน้าบันทึกค่าใช้จ่าย (`CostLogging`)
     - เพิ่มปุ่มนำทางไปยังหน้าปิดงานซ่อม (`CloseJob`)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.module.css`](Softdev_Frontend/src/pages/admin/UpdateProgress.module.css):
     - ปรับปรุง style สำหรับ `.checkItem` และ `.checkItem input[type="checkbox"]` เพื่อระยะห่างที่เหมาะสม
     - ปรับปรุง style สำหรับ `.historyDot` ให้มี padding และสีตามสถานะที่ถูกต้อง
     - ลบ style ของ `.header` ที่ไม่ใช้แล้วออก
     - เพิ่ม style สำหรับปุ่ม `costButton` และ `closeJobButton`
 - [`Softdev_Frontend/src/pages/user/ReportPage.jsx`](Softdev_Frontend/src/pages/user/ReportPage.jsx):
    - เพิ่มการ validate ประเภทไฟล์รูปภาพที่อัปโหลดได้ (.jpg, .jpeg, .png, .gif, .webp)
    - เพิ่มระบบเลือกอุปกรณ์แบบ Cascading Dropdown 3 ขั้นตอน (ห้อง/สถานที่, ประเภทอุปกรณ์, อุปกรณ์)
    - ดึงข้อมูล locations, asset_categories, assets จาก Supabase จริง
    - เปลี่ยนช่อง "รายละเอียด" (description) จาก required → optional
 - [`Softdev_Frontend/data/mock.js`](Softdev_Frontend/data/mock.js):
    - เพิ่มฟังก์ชัน `addRepairCost` สำหรับบันทึกค่าใช้จ่ายลงในหน่วยความจำจำลอง
    - เพิ่มฟังก์ชัน `updateReportStatus` สำหรับอัปเดตสถานะคำขอและเวลาปิดงาน
 - [`Softdev_Frontend/src/styles.css`](Softdev_Frontend/src/styles.css):
    - เพิ่ม Style สำหรับ Chart Grid และ Chart Cards ใน Admin Dashboard
    - ลบ `.icon-btn`, `.bell-btn`, `.bell-badge` ออก และย้ายไปไว้ใน [`Softdev_Frontend/src/components/Navbar.module.css`](Softdev_Frontend/src/components/Navbar.module.css) แทน
 - [`Softdev_Frontend/src/components/Navbar.jsx`](Softdev_Frontend/src/components/Navbar.jsx):
     - แก้ไขปุ่มระฆังให้อยู่ตรงกลางแนวตั้ง (แก้ไขสไตล์ `.notificationBtn`)
     - เพิ่มปุ่ม "ออกจากระบบ" (outline สีแดง) และ logic signOut + ลบ token + navigate "/"
 - [`Softdev_Frontend/src/components/Layout.jsx`](Softdev_Frontend/src/components/Layout.jsx):
     - แก้ไขปุ่มปิด X ใน Notification Center (เปลี่ยน `className` จาก `nc-close` เป็น `styles.closeBtn`)

 ## API Endpoints ที่ใช้
 - `GET /Auth/me`: สำหรับตรวจสอบ Role ของผู้ใช้หลัง Login
 - `GET /Notification/MyNotifications`: สำหรับดึงรายการแจ้งเตือนของผู้ใช้
 - `GET /Notification/UnreadCount`: สำหรับดึงจำนวนแจ้งเตือนที่ยังไม่ได้อ่าน
 - `PUT /Notification/MarkAllAsRead`: สำหรับทำเครื่องหมายแจ้งเตือนทั้งหมดว่าอ่านแล้ว
 - **ข้อควรทราบ:** ทุก API request ใช้ `fetch` และส่ง `Header: Authorization: Bearer <token>` จาก `localStorage.getItem("token")`
 
 ## Supabase Query Patterns ที่ใช้
 - `supabase.auth.getUser()`: สำหรับดึงข้อมูล session ของผู้ใช้
 - `supabase.from(\'users\').select(\'full_name\').eq(\'user_id\', user.id).single()`: สำหรับดึง `full_name` ของ user จาก table `users`
 - **ข้อควรทราบ:** สำหรับ `reports` ที่มี Foreign Key ไปยัง `users` สองตัว (reporter_id, technician_id) ต้องระบุ `users!reporter_id(full_name)` หรือ `users!technician_id(full_name)` เพื่อหลีกเลี่ยง ambiguous relationship ในอนาคต (ใน `data/mock.js` ใช้การ `enrichReports` เพื่อจำลองการ join)
 
 ## โครงสร้าง Component ที่มีอยู่และใช้งาน
 ### `UserNavbar` ([`Softdev_Frontend/src/components/UserNavbar.jsx`](Softdev_Frontend/src/components/UserNavbar.jsx))
 - **หน้าที่:** แถบนำทางสำหรับผู้ใช้งาน (นักศึกษา), แสดงโลโก้, ช่องค้นหา, ลิงก์ \'Home\' และ \'List\', ปุ่มแจ้งเตือน (bell icon) พร้อม Badge แสดงจำนวนที่ยังไม่อ่าน และข้อมูลผู้ใช้/ปุ่ม Sign out
 - **การใช้งาน:** นำมาใช้ในหน้า `MyReports.jsx` และ `ReportPage.jsx`
 - **การปรับปรุง:** เพิ่ม logic การแสดง NotificationPopup และการจัดการ `unreadCount`, ดึง `full_name` จาก Supabase, ลบ `currentUserId`
 
 ### `Footer` ([`Softdev_Frontend/src/components/Footer.jsx`](Softdev_Frontend/src/components/Footer.jsx))
 - **หน้าที่:** ส่วนท้ายของหน้าเว็บ แสดงข้อมูลลิขสิทธิ์
 - **การใช้งาน:** นำมาใช้ในหน้า `MyReports.jsx` และ `ReportPage.jsx`
 
 ### `RepairCard` ([`Softdev_Frontend/src/components/RepairCard.jsx`](Softdev_Frontend/src/components/RepairCard.jsx))
 - **หน้าที่:** แสดงข้อมูลสรุปของรายการแจ้งซ่อมแต่ละรายการ เช่น รูปภาพ, หัวข้อ, สถานะ, และวันที่แจ้งซ่อม
 - **การใช้งาน:** นำมาใช้ในหน้า `MyReports.jsx` และ `Report.jsx`
 - **การปรับปรุง:** เพิ่มการรองรับสถานะ `cancelled` พร้อม styling ที่เหมาะสม
 
 ### `NotificationPopup` ([`Softdev_Frontend/src/components/NotificationPopup.jsx`](Softdev_Frontend/src/components/NotificationPopup.jsx))
 - **หน้าที่:** แสดงรายการแจ้งเตือนแบบ popup เมื่อผู้ใช้คลิกที่ bell icon ใน `UserNavbar`
 - **การใช้งาน:** ถูก render แบบมีเงื่อนไขใน `UserNavbar.jsx`
 - **การพัฒนา:** ดึงข้อมูลการแจ้งเตือนจาก Backend API (`/Notification/MyNotifications`), แสดงสถานะแบบ color-coded, วันที่/เวลา, รายละเอียด (จาก `desc`), และชื่อช่าง (ถ้ามี), มีการทำเครื่องหมายว่าอ่านแล้ว (`/Notification/MarkAllAsRead`)
 
 ### `Navbar` ([`Softdev_Frontend/src/components/Navbar.jsx`](Softdev_Frontend/src/components/Navbar.jsx))
 - **หน้าที่:** แถบนำทางสำหรับผู้ดูแลระบบ (Admin), แสดงโลโก้, Breadcrumb, ปุ่มแจ้งเตือน (bell icon) พร้อม Badge แสดงจำนวนที่ยังไม่อ่าน และข้อมูลผู้ใช้/ปุ่ม Sign out
 - **การใช้งาน:** นำมาใช้ใน `Layout.jsx`
 - **การปรับปรุง:** เชื่อมต่อ state การเปิด/ปิด Notification Center กับ `Layout.jsx`, ปรับปรุงการแสดงผล Bell Icon และ Badge, **แก้ไขปุ่มระฆัง Admin Navbar ให้อยู่ตรงกลางแนวตั้ง, เพิ่มปุ่มออกจากระบบ Admin Navbar**
 
 ## สิ่งที่ยังไม่ได้ทำ (TODO)
 - Backend Admin API ยังไม่มี (ปัจจุบันใช้ mock data อยู่)
 - ทดสอบ Login จริงกับ Backend (รอเพื่อนร่วมทีม)
 - หน้า Admin จัดการ User (ยังไม่มีการพัฒนา)
 - หน้า Admin ข้อมูลครุภัณฑ์ (ยังไม่มีการพัฒนา)
 - การสร้างหน้า Admin ใหม่ๆ จะต้องมีการเชื่อมต่อกับ Backend API จริง (ปัจจุบันใช้ mock data)
 - ✅ แก้ไขปุ่มระฆัง Admin Navbar
 - ✅ เพิ่มปุ่มออกจากระบบ Admin Navbar
 - ✅ หน้า CostLogging
 - ✅ หน้า CloseJob
 
 ## ข้อควรระวัง
 - ห้ามยุ่งเกี่ยวกับโฟลเดอร์ `PSDP_Project` (เป็นส่วนของ Backend)
 - ใน `reports` model มี Foreign Key สองตัวที่อ้างอิงถึง `users` (`reporter_id`, `technician_id`) ซึ่งอาจต้องมีการ `join` แบบ explicit ใน query ของ Supabase หรือ Backend เพื่อหลีกเลี่ยงความกำกวม
 - API endpoint ไม่มี `/api/` นำหน้า แต่ใช้ผ่าน `vite` proxy
 - `data/mock.js` มีการใช้ `enrichReports` function เพื่อเตรียมข้อมูลให้หน้า Admin แสดงผลได้ถูกต้องตามโครงสร้างที่คาดหวัง
 
 ## Branch ที่ทำงาน
 - `Naphat`
 
 ---
 
 # Project Status Overview (Report Application)
 
 This summary provides a comprehensive overview of the current state of the Report Application project, encompassing both the Frontend and Backend components.
 
 ---
 
 ## 1. Full Directory Tree
 
 ### 💻 Frontend: `Softdev_Frontend/`
 ```
 Softdev_Frontend/
 ├── public/                 # Static assets (Favicons, Icons)
 ├── data/
 │   └── mock.js             # Comprehensive mock data for prototyping
 ├── src/
 │   ├── assets/             # Images, SVGs, and other UI assets
 │   ├── components/         # Reusable UI components
 │   │   ├── Footer.jsx
 │   │   ├── Layout.jsx      # Global Layout with Navbar/Footer
 │   │   ├── Navbar.jsx      # Admin Navbar
 │   │   ├── NotificationPopup.jsx
 │   │   ├── RepairCard.jsx  # Summary card for reports
 │   │   ├── UI.jsx          # Primitive UI elements (Pill, Card)
 │   │   └── UserNavbar.jsx  # User-specific Navbar
 │   │   ├── Navbar.module.css # NEW: Admin Navbar specific styles
 │   │   └── NotificationCenter.module.css # NEW: Notification Center specific styles
 │   ├── pages/
 │   │   ├── admin/          # Administrative interfaces
 │   │   │   ├── AdminDashboard.jsx
 │   │   │   ├── ManageRequests.jsx
 │   │   │   ├── RequestDetail.jsx
 │   │   │   ├── UpdateProgress.jsx
 │   │   │   ├── CostLogging.jsx    # NEW: Cost logging system
 │   │   │   └── CloseJob.jsx       # NEW: Job completion summary
 │   │   └── user/           # User interfaces (Reporter)
 │   │       ├── Login.jsx
 │   │       ├── MyReports.jsx
 │   │       ├── Register.jsx
 │   │       ├── Report.jsx      # Landing page for reporting
 │   │       └── ReportPage.jsx  # The actual reporting form
 │   ├── App.jsx             # Routing configuration
 │   ├── main.jsx            # Application entry point
 │   ├── styles.css          # Global styles
 │   └── supabaseClient.js   # Supabase configuration
 ├── index.html              # Entry HTML
 ├── package.json
 └── vite.config.js
 ```
 
 ### ⚙️ Backend: `PSDP_Project/` (ASP.NET Core 9.0)
 ```
 PSDP_Project/
 ├── Controllers/            # API Endpoints
 │   ├── AdminController.cs
 │   ├── AssetController.cs
 │   ├── AuthController.cs
 │   ├── HomeController.cs
 │   ├── NotificationController.cs
 │   └── ReportController.cs
 ├── Data/
 │   └── MyDbContext.cs      # EF Core Database Context
 ├── Models/                 # Database Schema & Data Transfer Objects
 │   ├── Asset.cs
 │   ├── Asset_category.cs
 │   ├── Location.cs
 │   ├── Notification.cs
 │   ├── Repair_cost.cs
 │   ├── Report.cs
 │   └── User.cs
 ├── Program.cs              # Server configuration
 ├── appsettings.json        # Environment variables
 ├── Dockerfile              # Containerization
 └── ...
 ```
 
 ---
 
 ## 2. Important File Analysis (Frontend)
 
 | File Path | Function | Exports | State Management | Data Source | Status |
 |-----------|----------|---------|------------------|-------------|--------|
 | `src/App.jsx` | Main Router | `App` | None | N/A | ✅ Completed |
 | `src/supabaseClient.js` | Database Auth | `supabase`, `getAccessToken` | Session handling | Supabase | ✅ Completed |
 | `src/pages/user/ReportPage.jsx` | Report Submission Form | `ReportPage` | `formData`, `assets`, `locations` | Supabase (Live) | ✅ Completed |
 | `src/pages/admin/UpdateProgress.jsx`| Admin Progress Update | `UpdateProgress` | `status`, `progressHistory` | Mock Data | ✅ Completed |
 | `src/pages/admin/CostLogging.jsx` | Cost Logging System | `CostLogging` | `costItems`, `newItem` | Mock Data | ✅ Completed |
 | `src/pages/admin/CloseJob.jsx` | Job Completion Summary | `CloseJob` | None | Mock Data | ✅ Completed |
 | `src/components/UserNavbar.jsx` | Nav for Users | `UserNavbar` | `userName`, `unreadCount` | Supabase & API | ✅ Completed |
 | `src/pages/user/Login.jsx` | User Authentication | `Login` | `email`, `password` | API (`/Auth/me`) | ✅ Completed |
 | `data/mock.js` | Mock Data Store | `reports`, `users`, `locations`, etc. | N/A | N/A | ⚠️ Mock |
 
 ---
 
 ## 3. Routing Table
 
 | Path | Component | Protected | Description |
 |------|-----------|-----------|-------------|
 | `/` | `Login` | No | Login screen |
 | `/register` | `Register` | No | Registration screen |
 | `/home` | `Report` | No* | User landing page |
 | `/report` | `ReportPage` | No* | Submission form |
 | `/my-reports` | `MyReports` | No* | User\'s own reports |
 | `/dashboard` | `AdminDashboard` | **Yes (Layout)** | Admin overview |
 | `/requests` | `ManageRequests` | **Yes (Layout)** | Request list |
 | `/requests/:id` | `RequestDetail` | **Yes (Layout)** | Detailed request view |
 | `/requests/:id/update-progress` | `UpdateProgress` | **Yes (Layout)** | Progress management |
 | `/requests/:id/cost-logging` | `CostLogging` | **Yes (Layout)** | Cost logging system |
 | `/requests/:id/close-job` | `CloseJob` | **Yes (Layout)** | Final job summary & closing |
 
 *\*Note: Currently partially protected by frontend logic, needs full backend session validation.*
 
 ---
 
 ## 4. Supabase Integration Status
 
 - **Configured:** Yes (`supabaseClient.js`)
 - **Queries Implemented:**
     - `locations`: Fetching building/floor/room list.
     - `asset_categories`: Fetching equipment types.
     - `assets`: Filtered by location and category.
     - `users`: Fetching profile information (full_name, phone).
     - `storage`: Uploading report images to `report-images` bucket.
 - **Pending Queries:**
     - Admin-side data fetching (currently uses `mock.js`).
     - Repair logs/history fetching for `UpdateProgress`.
 
 ---
 
 ## 5. Component Library (Reusable)
 
 | Component | Props | Purpose | Status |
 |-----------|-------|---------|--------|
 | `RepairCard` | `id`, `title`, `status`, `date`, `img` | Display report summaries | ✅ Completed |
 | `NotificationPopup` | `onClose`, `setUnreadCount` | Notification dropdown logic | ✅ Completed |
 | `Pill` | `tone` (ok, warn, progress, bad, muted), `children` | Status badges | ✅ Completed |
 | `Card` | `children`, `className` | Container for sections | ✅ Completed |
 
 ---
 
 ## 6. Summary Status (AI-Friendly Context)
 
 #### ✅ COMPLETED
 - User Authentication (Login/Register) with Backend Integration.
 - User-side reporting flow with cascading dropdowns (Supabase integrated).
 - Image upload validation and preview.
 - Application routing and global layout structures.
 - Admin UI pages: Dashboard, List, Detail, Update Progress, Cost Logging, and Close Job.
 - Inter-page navigation for Admin repair workflow.
 - **แก้ไขปุ่มระฆัง Admin Navbar**
 - **เพิ่มปุ่มออกจากระบบ Admin Navbar**
 - **หน้า CostLogging**
 - **หน้า CloseJob**
 
 #### 🔄 IN PROGRESS
 - **Admin Data Migration:** Moving admin pages from using `mock.js` to fetching from the `.NET` API.
 - **`UpdateProgress` / `CostLogging` Persistence:** Currently saving to memory-only mock data. Needs implementation of API calls to update `progress` (JSONB) and `repair_costs` table.
 
 #### ❌ NOT STARTED
 - Admin User Management (Manage User roles).
 - Admin Asset Management (Add/Edit inventory).
 - Real-time notifications (currently using polling/fetch on load).
 
 #### ⚠️ MOCK DATA
 - All Admin pages (`AdminDashboard`, `ManageRequests`, `RequestDetail`, `UpdateProgress`, `CostLogging`, `CloseJob`) still rely heavily on `data/mock.js` for their primary data views and updates. These must be replaced with `fetch` calls to the Backend API.
 
 ---
 **System Ready for Session Handoff.** Admin workflow UI is fully implemented. Proceed with Backend API integration for all Admin pages.

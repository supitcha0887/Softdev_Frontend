# สรุปความคืบหน้าการพัฒนา Frontend (Branch: Naphat)
 
 ## ไฟล์ที่สร้าง/แก้ไขทั้งหมด
 
 ### สร้างใหม่
 - [`Softdev_Frontend/public/favicon.png`](Softdev_Frontend/public/favicon.png)
 - [`Softdev_Frontend/public/Icon.png`](Softdev_Frontend/public/Icon.png)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.jsx`](Softdev_Frontend/src/pages/admin/UpdateProgress.jsx)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.module.css`](Softdev_Frontend/src/pages/admin/UpdateProgress.module.css)
 
 ### แก้ไข
 - [`Softdev_Frontend/index.html`](Softdev_Frontend/index.html):
     - เปลี่ยน `<title>` เป็น "Report Application"
     - เปลี่ยน favicon ให้ชี้ไปที่ `/favicon.png` (เดิมเป็น `/vite.svg` หรือ `/favicon.svg`)
 - [`Softdev_Frontend/src/pages/user/ReportPage.jsx`](Softdev_Frontend/src/pages/user/ReportPage.jsx):
     - เพิ่มการ validate ประเภทไฟล์รูปภาพที่อัปโหลดได้ (.jpg, .jpeg, .png, .gif, .webp)
     - เพิ่มระบบเลือกอุปกรณ์แบบ Cascading Dropdown 3 ขั้นตอน (ห้อง/สถานที่, ประเภทอุปกรณ์, อุปกรณ์)
     - ดึงข้อมูล locations, asset_categories, assets จาก Supabase จริง
 - [`Softdev_Frontend/src/pages/admin/RequestDetail.jsx`](Softdev_Frontend/src/pages/admin/RequestDetail.jsx): เพิ่มลิงก์ไปยังหน้าอัปเดตความคืบหน้าการซ่อม
 - [`Softdev_Frontend/src/App.jsx`](Softdev_Frontend/src/App.jsx):
     - เพิ่ม route สำหรับหน้า `/requests/:id/update-progress`
     - เพิ่ม route สำหรับหน้า MyReports
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.jsx`](Softdev_Frontend/src/pages/admin/UpdateProgress.jsx):
     - ปรับปรุงการแสดงผล dropdown สถานะงานให้มีตัวเลือกที่แน่นอนและเป็นภาษาไทย
     - ปรับปรุงการแสดงผล checklist item ให้มีระยะห่างที่ถูกต้อง
     - เพิ่มระบบอัปโหลดรูปภาพพร้อม preview สำหรับรูปภาพหลังการซ่อม
     - ปรับปรุง Header section ให้ใช้ style เดียวกับหน้า Admin อื่นๆ (background image และ text color)
 - [`Softdev_Frontend/src/pages/admin/UpdateProgress.module.css`](Softdev_Frontend/src/pages/admin/UpdateProgress.module.css):
     - ปรับปรุง style สำหรับ `.checkItem` และ `.checkItem input[type="checkbox"]` เพื่อระยะห่างที่เหมาะสม
     - ปรับปรุง style สำหรับ `.historyDot` ให้มี padding และสีตามสถานะที่ถูกต้อง
     - ลบ style ของ `.header` ที่ไม่ใช้แล้วออก
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
 - [`Softdev_Frontend/src/pages/admin/AdminDashboard.jsx`](Softdev_Frontend/src/pages/admin/AdminDashboard.jsx): เปลี่ยนการ import และการใช้งาน `requests` เป็น `reports`
 - [`Softdev_Frontend/src/pages/admin/ManageRequests.jsx`](Softdev_Frontend/src/pages/admin/ManageRequests.jsx): เปลี่ยนการ import และการใช้งาน `requests` เป็น `reports`
 - [`Softdev_Frontend/src/pages/admin/RequestDetail.jsx`](Softdev_Frontend/src/pages/admin/RequestDetail.jsx): เปลี่ยนการ import และการใช้งาน `requests` เป็น `reports`
 - `.env.example` และ `package-lock.json`: จัดการไฟล์ build ที่เกี่ยวข้อง (ลบ `.env.example`, แก้ไข `package-lock.json`)
 
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
 
 ## สิ่งที่ยังไม่ได้ทำ (TODO)
 - Backend Admin API ยังไม่มี (ปัจจุบันใช้ mock data อยู่)
 - ทดสอบ Login จริงกับ Backend (รอเพื่อนร่วมทีม)
 - หน้า Admin จัดการ User (ยังไม่มีการพัฒนา)
 - หน้า Admin ข้อมูลครุภัณฑ์ (ยังไม่มีการพัฒนา)
 - การสร้างหน้า Admin ใหม่ๆ จะต้องมีการเชื่อมต่อกับ Backend API จริง (ปัจจุบันใช้ mock data)
 
 ## ข้อควรระวัง
 - ห้ามยุ่งเกี่ยวกับโฟลเดอร์ `PSDP_Project` (เป็นส่วนของ Backend)
 - ใน `reports` model มี Foreign Key สองตัวที่อ้างอิงถึง `users` (`reporter_id`, `technician_id`) ซึ่งอาจต้องมีการ `join` แบบ explicit ใน query ของ Supabase หรือ Backend เพื่อหลีกเลี่ยงความกำกวม
 - API endpoint ไม่มี `/api/` นำหน้า แต่ใช้ผ่าน `vite` proxy
 - `data/mock.js` มีการใช้ `enrichReports` function เพื่อเตรียมข้อมูลให้หน้า Admin แสดงผลได้ถูกต้องตามโครงสร้างที่คาดหวัง
 
 ## Branch ที่ทำงาน
 - `Naphat`
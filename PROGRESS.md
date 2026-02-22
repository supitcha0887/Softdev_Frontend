# สรุปความคืบหน้าการพัฒนา Frontend (Branch: Naphat)

## ไฟล์ที่สร้าง/แก้ไขทั้งหมด

### สร้างใหม่
- [`Softdev_Frontend/src/pages/user/MyReports.jsx`](Softdev_Frontend/src/pages/user/MyReports.jsx)
- [`Softdev_Frontend/src/pages/user/MyReports.module.css`](Softdev_Frontend/src/pages/user/MyReports.module.css)
- [`Softdev_Frontend/src/components/NotificationPopup.jsx`](Softdev_Frontend/src/components/NotificationPopup.jsx)
- [`Softdev_Frontend/src/components/NotificationPopup.module.css`](Softdev_Frontend/src/components/NotificationPopup.module.css)

### แก้ไข
- [`Softdev_Frontend/src/App.jsx`](Softdev_Frontend/src/App.jsx): เพิ่ม route สำหรับหน้า MyReports
- [`Softdev_Frontend/src/components/RepairCard.jsx`](Softdev_Frontend/src/components/RepairCard.jsx): เพิ่มสถานะ `cancelled` และอัปเดต `statusMap`
- [`Softdev_Frontend/src/components/RepairCard.module.css`](Softdev_Frontend/src/components/RepairCard.module.css): เพิ่ม style สำหรับสถานะ `cancelled`
- [`Softdev_Frontend/src/components/UserNavbar.jsx`](Softdev_Frontend/src/components/UserNavbar.jsx): อัปเดตลิงก์ 'List' ให้ชี้ไปที่ `/my-reports`, เพิ่ม logic สำหรับแสดง NotificationPopup, จัดการ state `showNotifications` และ `currentUserId`.
- [`Softdev_Frontend/src/pages/user/MyReports.module.css`](Softdev_Frontend/src/pages/user/MyReports.module.css): ปรับขนาด font size สำหรับหัวข้อส่วน (section titles) เป็น `24px`.
- `.env.example` และ `package-lock.json`: จัดการไฟล์ build ที่เกี่ยวข้อง (ลบ `.env.example`, แก้ไข `package-lock.json`).

## โครงสร้าง Component ที่มีอยู่และใช้งาน

### `UserNavbar` ([`Softdev_Frontend/src/components/UserNavbar.jsx`](Softdev_Frontend/src/components/UserNavbar.jsx))
- **หน้าที่:** แถบนำทางสำหรับผู้ใช้งาน (นักศึกษา), แสดงโลโก้, ช่องค้นหา, ลิงก์ 'Home' และ 'List', ปุ่มแจ้งเตือน (bell icon) และข้อมูลผู้ใช้/ปุ่ม Sign out.
- **การใช้งาน:** นำมาใช้ในหน้า `MyReports.jsx` และ `ReportPage.jsx`.
- **การปรับปรุง:** เพิ่ม logic การแสดง NotificationPopup และการจัดการ `userId`.

### `Footer` ([`Softdev_Frontend/src/components/Footer.jsx`](Softdev_Frontend/src/components/Footer.jsx))
- **หน้าที่:** ส่วนท้ายของหน้าเว็บ แสดงข้อมูลลิขสิทธิ์.
- **การใช้งาน:** นำมาใช้ในหน้า `MyReports.jsx` และ `ReportPage.jsx`.

### `RepairCard` ([`Softdev_Frontend/src/components/RepairCard.jsx`](Softdev_Frontend/src/components/RepairCard.jsx))
- **หน้าที่:** แสดงข้อมูลสรุปของรายการแจ้งซ่อมแต่ละรายการ เช่น รูปภาพ, หัวข้อ, สถานะ, และวันที่แจ้งซ่อม.
- **การใช้งาน:** นำมาใช้ในหน้า `MyReports.jsx` และ `Report.jsx`.
- **การปรับปรุง:** เพิ่มการรองรับสถานะ `cancelled` พร้อม styling ที่เหมาะสม.

### `NotificationPopup` ([`Softdev_Frontend/src/components/NotificationPopup.jsx`](Softdev_Frontend/src/components/NotificationPopup.jsx))
- **หน้าที่:** แสดงรายการแจ้งเตือนแบบ popup เมื่อผู้ใช้คลิกที่ bell icon ใน `UserNavbar`.
- **การใช้งาน:** ถูก render แบบมีเงื่อนไขใน `UserNavbar.jsx`.
- **การพัฒนา:** ดึงข้อมูลการแจ้งเตือนจาก Supabase, แสดงสถานะแบบ color-coded, วันที่/เวลา, รายละเอียด, และชื่อช่าง (ถ้ามี).

## Supabase Query Patterns ที่ใช้

มีการใช้ Supabase client (`supabaseClient.js`) สำหรับการดึงข้อมูลจาก backend:

1.  **การดึงข้อมูล Reports (ใน `MyReports.jsx`):**
    *   ดึงข้อมูลจาก table `reports` พร้อม join `locations` และ `assets`.
    *   มีการ filter ตาม `reporter_id` ของ user ที่ login อยู่ และตาม `status` (pending, in_progress, completed, cancelled).
    *   เรียงลำดับตาม `created_at` (DESC หรือ ASC).
    ```javascript
    supabase
      .from("reports")
      .select(`
        *,
        locations (location_name, building, floor, room),
        assets (asset_name, asset_number)
      `)
      .eq("user_id", userId) // ใช้ reporter_id สำหรับ MyReports.jsx
      .order("created_at", { ascending: sortBy === "date_asc" });
    ```

2.  **การดึงข้อมูล Notifications (ใน `NotificationPopup.jsx`):**
    *   ดึงข้อมูลจาก table `notifications` โดย filter ตาม `user_id` ของ user ที่ login อยู่.
    *   มีการ join กับ table `reports` (ผ่าน `related_report_id`) และ `users` (ผ่าน `technician_id` ใน `reports`) เพื่อดึงชื่อช่างที่เกี่ยวข้อง.
    *   **การแก้ไขสำคัญ:** แก้ไขปัญหา ambiguous relationship โดยระบุ foreign key ชัดเจนสำหรับ `users` join เป็น `technician_info:users!technician_id(full_name)`.
    ```javascript
    supabase
      .from("notifications")
      .select(`
        *,
        related_report_id,
        reports (technician_id, technician_info:users!technician_id(full_name))
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    ```

3.  **การดึงข้อมูล User Session และ User ID (ใน `UserNavbar.jsx` และ `MyReports.jsx`):**
    *   ใช้ `supabase.auth.getUser()` เพื่อดึงข้อมูล user ที่ login อยู่, รวมถึง `user.id` และ `user.user_metadata?.full_name`.

## Branch ที่ทำงาน
- `Naphat`
# ⚙️ ระบบแจ้งซ่อมครุภัณฑ์ ภาควิชาวิศวกรรมคอมพิวเตอร์ KMITL — Frontend

---

## 📌 ภาพรวม (Overview)

แอปพลิเคชันสำหรับแจ้งซ่อมและจัดการคำขอซ่อมภายในอาคาร ECC ของภาควิชาวิศวกรรมคอมพิวเตอร์ KMITL รองรับผู้ใช้ทั่วไป (นักศึกษา) และผู้ดูแลระบบ (Admin)

---

## 🧱 Tech Stack

| เทคโนโลยี | หน้าที่ |
|-----------|--------|
| ⚛️ React   | UI Framework |
| ⚡ Vite    | Build Tool |
| 🟢 Supabase | Authentication & Session, Database |
| 🎨 CSS Modules | Component-scoped Styling |

---

## 📂 โครงสร้างโฟลเดอร์ปัจจุบัน

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
│   │   ├── Navbar.module.css # Admin Navbar specific styles
│   │   ├── NotificationCenter.module.css # Notification Center specific styles
│   │   ├── NotificationPopup.jsx
│   │   ├── RepairCard.jsx  # Summary card for reports
│   │   ├── UI.jsx          # Primitive UI elements (Pill, Card)
│   │   └── UserNavbar.jsx  # User-specific Navbar
│   ├── pages/
│   │   ├── admin/          # Administrative interfaces
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CloseJob.jsx       # Job completion summary
│   │   │   ├── CostLogging.jsx    # Cost logging system
│   │   │   ├── ManageRequests.jsx
│   │   │   ├── RequestDetail.jsx
│   │   │   └── UpdateProgress.jsx # Work progress management
│   │   └── user/           # User interfaces (Reporter)
│   │       ├── Login.jsx
│   │       ├── MyReports.jsx
│   │       ├── Register.jsx
│   │       ├── Report.jsx      # Landing page for reporting
│   │       └── ReportPage.jsx  # The actual reporting form
│   ├── App.jsx             # Routing configuration
│   ├── main.jsx            # Application entry point
│   ├── styles.css          # Global styles
│   ├── supabaseClient.js   # Supabase configuration
│   └── utils/
│       └── imageUtils.js   # Image processing & compression utilities
├── index.html              # Entry HTML
├── package.json
└── vite.config.js
```

---

## 🚀 การติดตั้งและรันโปรเจค

1.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```
2.  **สร้างไฟล์ .env:**
    คัดลอกจาก `.env.example` แล้วกรอกค่า Environment Variables
3.  **รันโหมดพัฒนา:**
    ```bash
    npm run dev
    ```

---

## 🛣️ หน้าที่มีในระบบ (Routing)

### User Side

*   `/` : `Login` - หน้าจอเข้าสู่ระบบ
*   `/register` : `Register` - หน้าจอลงทะเบียน
*   `/home` : `Report` - หน้าหลักสำหรับผู้ใช้งาน
*   `/report` : `ReportPage` - ฟอร์มสำหรับแจ้งซ่อม (รองรับการบีบอัดรูปภาพอัตโนมัติ)
*   `/my-reports` : `MyReports` - รายการแจ้งซ่อมส่วนตัวของผู้ใช้งาน

### Admin Side

*   `/dashboard` : `AdminDashboard` - ภาพรวมการแจ้งซ่อมสำหรับผู้ดูแลระบบ
*   `/requests` : `ManageRequests` - รายการคำขอซ่อมทั้งหมด
*   `/requests/:id` : `RequestDetail` - หน้ารายละเอียดคำขอซ่อม
*   `/requests/:id/update-progress` : `UpdateProgress` - หน้าจัดการความคืบหน้าการซ่อม (รองรับการบีบอัดรูปภาพอัตโนมัติ)
*   `/requests/:id/cost-logging` : `CostLogging` - หน้าระบบบันทึกค่าใช้จ่าย
*   `/requests/:id/close-job` : `CloseJob` - หน้าสรุปและปิดงานซ่อม

---

## ♻️ Component ที่ใช้ซ้ำได้

| Component | Purpose |
|-----------|---------|
| [`RepairCard`](Softdev_Frontend/src/components/RepairCard.jsx) | แสดงข้อมูลสรุปของรายการแจ้งซ่อมแต่ละรายการ |
| [`NotificationPopup`](Softdev_Frontend/src/components/NotificationPopup.jsx) | แสดงรายการแจ้งเตือนแบบ popup |
| [`Pill`](Softdev_Frontend/src/components/UI.jsx) | Status badges (เช่น สถานะ OK, Warn) |
| [`Card`](Softdev_Frontend/src/components/UI.jsx) | Container สำหรับส่วนต่างๆ |

---

## ⚙️ Environment Variables ที่ต้องตั้งค่า

> ⚠️ Vite ต้องใช้ prefix `VITE_`

| ตัวแปร | คำอธิบาย |
|--------|---------|
| `VITE_SUPABASE_URL` | URL โปรเจกต์ Supabase |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public Key |
| `VITE_API_BASE_URL` | URL ของ Backend API |

### 📄 ตัวอย่าง `.env`

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=http://localhost:5070/api
```

---

## ⚠️ ข้อควรระวัง

*   ห้ามยุ่งเกี่ยวกับโฟลเดอร์ `PSDP_Project` (เป็นส่วนของ Backend)
*   ใน `reports` model มี Foreign Key สองตัวที่อ้างอิงถึง `users` (`reporter_id`, `technician_id`) ซึ่งอาจต้องมีการ `join` แบบ explicit ใน query ของ Supabase หรือ Backend เพื่อหลีกเลี่ยงความกำกวม
*   หน้า Admin ทุกหน้า (`AdminDashboard`, `ManageRequests`, `RequestDetail`, `UpdateProgress`, `CostLogging`, `CloseJob`) ยังคงใช้ `data/mock.js` สำหรับข้อมูลหลักและการอัปเดต ต้องเปลี่ยนไปใช้ `fetch` calls กับ Backend API ในอนาคต
*   **การอัปโหลดรูปภาพ:** ระบบมีการจำกัดขนาดไฟล์ไว้ที่ **10 MB** และจะทำการบีบอัด (Compress) รูปภาพอัตโนมัติเป็น JPEG ก่อนทำการอัปโหลดเพื่อประหยัดพื้นที่จัดเก็บ
*   API endpoint ไม่มี `/api/` นำหน้า แต่ใช้ผ่าน `vite` proxy

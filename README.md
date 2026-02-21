# 🛠️ ECC Repair Requests — Frontend

---

## 📌 ภาพรวม (Overview)

แอปพลิเคชันสำหรับแจ้งซ่อมและจัดการคำขอซ่อมภายในอาคาร ECC  
รองรับผู้ใช้ทั่วไปและผู้ดูแลระบบ

### ✨ คุณสมบัติหลัก

- 🔐 Login / Register ด้วย Supabase Auth  
- 📝 แจ้งปัญหาการซ่อม  
- 👨‍💼 Admin Dashboard สำหรับผู้ดูแลระบบ  
- 🔎 ดูรายละเอียดคำขอซ่อม  
- 🔄 ตรวจสอบ Session และ Token  

---

## 🧱 Tech Stack

| เทคโนโลยี | หน้าที่ |
|-----------|--------|
| ⚛️ React | UI Framework |
| ⚡ Vite | Build Tool |
| 🟢 Supabase | Authentication & Session |
| 🌐 REST API | เชื่อมต่อ Backend |

---

## 📂 โครงสร้างโปรเจกต์

```text
src/
 ├── supabaseClient.js
 ├── Login.jsx
 ├── Register.jsx
 ├── Report.jsx
 └── pages/
     ├── AdminDashboard.jsx
     ├── ManageRequests.jsx
     └── RequestDetail.jsx

public/
assets/
.env
.env.example
```

---

## ⚙️ Environment Variables

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

## 🚀 การติดตั้งและใช้งาน

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Pathornnnnn/Softdev_Frontend.git
cd Softdev_Frontend
```

### 2️⃣ ติดตั้ง Dependencies
```bash
npm install
```

### 3️⃣ สร้างไฟล์ .env

คัดลอกจาก .env.example แล้วกรอกค่า

### 4️⃣ รันโหมดพัฒนา
```bash
npm run dev
```

### 5️⃣ Build สำหรับ Production
```bash
npm run build
```

### 6️⃣ Preview Production Build
```bash
npm run preview
```

---

### 🔗 การใช้งาน Environment Variables
🔐 สร้าง Supabase Client
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

🌐 เรียก Backend API
fetch(`${import.meta.env.VITE_API_BASE_URL}/Auth/verify-token`);

---
### 🛡️ Best Practices

✅ ใช้ .env.example เป็น template

❌ ห้าม commit .env

🔁 รีสตาร์ท dev server หลังแก้ .env

### ☁️ ตั้งค่า env บน Hosting (Vercel / Netlify / Cloudflare)

---

🧯 Troubleshooting
❗ Environment Variables เป็น undefined

✔ ตรวจสอบว่ามีไฟล์ .env
✔ รีสตาร์ท npm run dev

❗ API เรียกไม่ได้

✔ ตรวจสอบ VITE_API_BASE_URL
✔ ตรวจสอบว่ามี /api ตาม backend

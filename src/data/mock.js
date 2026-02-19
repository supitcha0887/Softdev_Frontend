import new_work from "../assets/new_work.png";
import pending from "../assets/pending.png";
import progress from "../assets/progress.png";
import finish from "../assets/finish.png";
export const STATUS = {
  // UI requirement: show "เร่งด่วน" instead of "ใหม่"
  NEW: "เร่งด่วน",
  PENDING: "รอรับงาน",
  PROGRESS: "กำลังดำเนินการ",
  DONE: "เสร็จสิ้น",
  CANCELED: "ยกเลิก",
};

export const statusTone = (s) => {
  if (s === STATUS.DONE) return "ok";

  // ✅ สีสถานะให้เหมือนกันทุกหน้า (Dashboard + Manage Requests)
  if (s === STATUS.PROGRESS) return "warn";  // เหลือง
  if (s === STATUS.PENDING) return "muted";  // เทา
  if (s === STATUS.NEW) return "bad";        // แดง (เร่งด่วน)

  return "bad";
};

export const statusToneList = (s) => {
  // กันพังไว้ เผื่อหน้าเดิมยังเรียกใช้ชื่อเดิม
  return statusTone(s);
};


export const requests = [
  {
    id: "REQ-2024-001",
    titleTH: "เครื่องปรับอากาศเสีย",
    titleEN: "Air Conditioner Broken",
    locationTH: "อาคาร A ชั้น 1 ห้อง A201",
    locationEN: "Building A, Floor 1, Room A201",
    typeTH: "ไฟฟ้า/แอร์",
    assetNo: "AC-A201-01",
    reporter: "Somchai Jaidee",
    tel: "081-234-5678",
    dateTH: "15 ม.ค. 2567",
    dateEN: "Jan 15, 2024",
    status: STATUS.PENDING,
    assigned: "Unassigned",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "REQ-2024-002",
    titleTH: "โปรเจคเตอร์ไม่ทำงาน",
    titleEN: "Projector Not Working",
    locationTH: "อาคาร B ชั้น 1 ห้อง B105",
    locationEN: "Building B, Floor 1, Room B105",
    typeTH: "โสตฯ",
    assetNo: "PJ-B105-02",
    reporter: "Prof. Wirat",
    tel: "081-555-9999",
    dateTH: "15 ม.ค. 2567",
    dateEN: "Jan 15, 2024",
    status: STATUS.PROGRESS,
    assigned: "STAFF-0004",
    img: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "REQ-2024-003",
    titleTH: "หน้าต่างแตก",
    titleEN: "Broken Window",
    locationTH: "อาคาร C ชั้น 2 ห้อง C302",
    locationEN: "Building C, Floor 2, Room C302",
    typeTH: "อาคาร",
    assetNo: "WIN-C302-01",
    reporter: "Sunisa",
    tel: "089-111-2222",
    dateTH: "14 ม.ค. 2567",
    dateEN: "Jan 14, 2024",
    status: STATUS.NEW,
    assigned: "Unassigned",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "REQ-2024-004",
    titleTH: "เก้าอี้ห้องเรียนชำรุด",
    titleEN: "Broken Classroom Chair",
    locationTH: "อาคาร A ชั้น 3 ห้อง A301",
    locationEN: "Building A, Floor 3, Room A301",
    typeTH: "เฟอร์นิเจอร์",
    assetNo: "CHAIR-A301-15",
    reporter: "Somchai Jaidee",
    tel: "081-234-5678",
    dateTH: "15 ม.ค. 2567",
    dateEN: "Jan 15, 2024",
    status: STATUS.PENDING,
    assigned: "Unassigned",
    img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=60",
  },
];

export const stats = [
  { labelTH: "คำขอใหม่", labelEN: "New Requests", value: 12, pill: "NEW", tone: "muted",
    icon: new_work },
  { labelTH: "รอรับงาน", labelEN: "Pending", value: 8, pill: "PENDING", tone: "warn", icon: pending },
  { labelTH: "กำลังดำเนินการ", labelEN: "In Progress", value: 15, pill: "PROGRESS", tone: "progress", icon: progress },
  { labelTH: "เสร็จสิ้น", labelEN: "Completed", value: 24, pill: "DONE", tone: "ok", icon: finish },
];

export const notifications = [
  {
    id: "n1",
    read: false,
    statusKey: "PROGRESS",
    pillText: "ดำเนินการ",
    pillTone: "pill-warn",
    timeAgo: "2 นาทีที่แล้ว",
    title: "การแจ้งซ่อมใหม่ - ห้อง A301",
    desc: "เครื่องปรับอากาศไม่เย็น ต้องการซ่อมด่วน",
    requestId: requests[0]?.id,   // ✅ ใช้ id จริงจาก requests
  },
  {
    id: "n2",
    read: true,
    statusKey: "DONE",
    pillText: "เสร็จสิ้น",
    pillTone: "pill-ok",
    timeAgo: "15 นาทีที่แล้ว",
    title: "งานซ่อมเสร็จสิ้น - ห้อง B205",
    desc: "ซ่อมหลอดไฟเสร็จเรียบร้อยแล้ว",
    requestId: requests[1]?.id,
  },
  {
    id: "n3",
    read: false,
    statusKey: "PENDING",
    pillText: "รอรับงาน",
    pillTone: "pill-muted",
    timeAgo: "1 ชั่วโมงที่แล้ว",
    title: "การแจ้งซ่อมใหม่ - ห้อง C102",
    desc: "โต๊ะนักศึกษาชำรุด",
    requestId: requests[2]?.id,
  },
  {
    id: "n4",
    read: true,
    statusKey: "NEW",
    pillText: "ด่วน",
    pillTone: "pill-bad",
    timeAgo: "2 ชั่วโมงที่แล้ว",
    title: "งานซ่อมฉุกเฉิน - ห้อง D401",
    desc: "กลิ่นไหม้จากปลั๊กไฟ ต้องซ่อมด่วน",
    requestId: requests[3]?.id,
  },
];
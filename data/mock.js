import new_work from "../src/assets/new_work.svg";
import pending from "../src/assets/pending.svg";
import progress from "../src/assets/progress.svg";
import finish from "../src/assets/finish.svg";

export const STATUS = {
  PENDING: "รอรับงาน",
  APPROVED: "อนุมัติ",
  IN_PROGRESS: "กำลังดำเนินการ",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
};

export const statusTone = (s) => {
  if (s === STATUS.COMPLETED) return "ok";
  if (s === STATUS.IN_PROGRESS) return "progress";
  if (s === STATUS.PENDING) return "muted";
  if (s === STATUS.APPROVED) return "warn";
  if (s === STATUS.CANCELLED) return "bad";
  return "muted";
};

export const statusToneList = (s) => {
  return statusTone(s);
};

export const asset_categories = [
  { id: "CAT001", type_name: "เครื่องปรับอากาศ", description: "อุปกรณ์ทำความเย็น" },
  { id: "CAT002", type_name: "โปรเจคเตอร์", description: "อุปกรณ์นำเสนอภาพ" },
  { id: "CAT003", type_name: "คอมพิวเตอร์", description: "คอมพิวเตอร์ตั้งโต๊ะและโน้ตบุ๊ก" },
  { id: "CAT004", type_name: "เครื่องพิมพ์", description: "เครื่องพิมพ์เลเซอร์และอิงค์เจ็ต" },
  { id: "CAT005", type_name: "เครือข่าย", description: "อุปกรณ์เครือข่าย เช่น Router, Switch" },
  { id: "CAT006", type_name: "เฟอร์นิเจอร์", description: "โต๊ะ, เก้าอี้, ตู้" },
  { id: "CAT007", type_name: "ไฟฟ้า", description: "ระบบไฟฟ้า, ปลั๊กไฟ, หลอดไฟ" },
  { id: "CAT008", type_name: "โสตทัศนูปกรณ์", description: "ไมโครโฟน, ลำโพง, จอภาพ" },
  { id: "CAT009", type_name: "สุขภัณฑ์", description: "อุปกรณ์ในห้องน้ำ" },
  { id: "CAT010", type_name: "ยานพาหนะ", description: "รถยนต์, รถจักรยานยนต์ของภาควิชา" },
  { id: "CAT011", type_name: "ซอฟต์แวร์", description: "โปรแกรมและระบบปฏิบัติการ" },
];

export const locations = [
  { id: "LOC001", location_name: "ห้องปฏิบัติการคอมพิวเตอร์ 1", building: "ตึกพระเทพ", floor: "3", room: "301" },
  { id: "LOC002", location_name: "ห้องปฏิบัติการคอมพิวเตอร์ 2", building: "ตึกพระเทพ", floor: "3", room: "302" },
  { id: "LOC003", location_name: "ห้องสัมมนา 1", building: "ตึกพระเทพ", floor: "4", room: "401" },
  { id: "LOC004", location_name: "ห้องพักอาจารย์ 1", building: "ตึกพระเทพ", floor: "5", room: "501" },
  { id: "LOC005", location_name: "ห้องเรียน CE1", building: "ตึกเรียนรวม", floor: "2", room: "201" },
  { id: "LOC006", location_name: "ห้อง Server", building: "ตึกพระเทพ", floor: "1", room: "Server Room" },
  { id: "LOC007", location_name: "ห้องประชุมใหญ่", building: "ตึกภาควิชา", floor: "2", room: "Meeting Hall" },
  { id: "LOC008", location_name: "ห้องสมุดภาควิชา", building: "ตึกภาควิชา", floor: "3", room: "Library" },
  { id: "LOC009", location_name: "ห้องน้ำชาย ชั้น 3", building: "ตึกพระเทพ", floor: "3", room: "Male Restroom" },
  { id: "LOC010", location_name: "สำนักงานภาควิชา", building: "ตึกภาควิชา", floor: "1", room: "Office" },
  { id: "LOC011", location_name: "ห้องวิจัยระบบสมองกลฝังตัว", building: "ตึกวิจัย", floor: "1", room: "ERL" },
];

export const users = [
  { id: "USER001", full_name: "นายสมชาย ใจดี", email: "somchai.j@kmitl.ac.th", phone: "0811112222", is_admin: false, created_at: "2023-01-01T08:00:00Z" },
  { id: "USER002", full_name: "นางสาวอรุณี รักษา", email: "arunee.r@kmitl.ac.th", phone: "0822223333", is_admin: true, created_at: "2023-01-05T09:00:00Z" },
  { id: "USER003", full_name: "นายปรีชา ตั้งใจ", email: "preecha.t@kmitl.ac.th", phone: "0833334444", is_admin: false, created_at: "2023-01-10T10:00:00Z" },
  { id: "USER004", full_name: "นางสาวสุดารัตน์ งามยิ่ง", email: "sudarat.n@kmitl.ac.th", phone: "0844445555", is_admin: false, created_at: "2023-01-15T11:00:00Z" },
  { id: "USER005", full_name: "อาจารย์มานะ เก่งมาก", email: "mana.k@kmitl.ac.th", phone: "0855556666", is_admin: true, created_at: "2023-02-01T12:00:00Z" },
  { id: "USER006", full_name: "นายพงษ์ศักดิ์ รุ่งเรือง", email: "pongsak.r@kmitl.ac.th", phone: "0866667777", is_admin: false, created_at: "2023-02-05T13:00:00Z" },
  { id: "USER007", full_name: "นางสาวกานดา มีสุข", email: "kanda.m@kmitl.ac.th", phone: "0877778888", is_admin: false, created_at: "2023-02-10T14:00:00Z" },
  { id: "USER008", full_name: "นายเฉลิมพล ดีเด่น", email: "chalermpol.d@kmitl.ac.th", phone: "0888889999", is_admin: false, created_at: "2023-02-15T15:00:00Z" },
  { id: "USER009", full_name: "นางสาววิไลลักษณ์ สุขใจ", email: "wilailak.s@kmitl.ac.th", phone: "0912345678", is_admin: false, created_at: "2023-03-01T16:00:00Z" },
  { id: "USER010", full_name: "นายช่างไฟฟ้า วรวุฒิ", email: "worawut.e@kmitl.ac.th", phone: "0923456789", is_admin: true, created_at: "2023-03-05T17:00:00Z" },
  { id: "USER011", full_name: "นายช่างแอร์ ชัยยันต์", email: "chaiyan.a@kmitl.ac.th", phone: "0934567890", is_admin: true, created_at: "2023-03-10T18:00:00Z" },
];

export const assets = [
  { id: "AST001", asset_name: "เครื่องปรับอากาศ Daikin", asset_number: "AC-CE301-01", category_id: "CAT001", brand: "Daikin", model: "FTKM09NV2S", serial_number: "D0012345", location_id: "LOC001", status: "ใช้งานได้" },
  { id: "AST002", asset_name: "โปรเจคเตอร์ Epson", asset_number: "PJ-CE302-01", category_id: "CAT002", brand: "Epson", model: "EB-X400", serial_number: "E0056789", location_id: "LOC002", status: "ใช้งานได้" },
  { id: "AST003", asset_name: "คอมพิวเตอร์ Dell OptiPlex", asset_number: "PC-CE301-05", category_id: "CAT003", brand: "Dell", model: "OptiPlex 3070", serial_number: "DPC11223", location_id: "LOC001", status: "ใช้งานได้" },
  { id: "AST004", asset_name: "เครื่องพิมพ์ HP LaserJet", asset_number: "PRN-CE401-01", category_id: "CAT004", brand: "HP", model: "LaserJet Pro M404n", serial_number: "HP004455", location_id: "LOC003", status: "ใช้งานได้" },
  { id: "AST005", asset_name: "Switch Cisco Catalyst 2960", asset_number: "NET-SR-01", category_id: "CAT005", brand: "Cisco", model: "Catalyst 2960", serial_number: "CIS12345", location_id: "LOC006", status: "ใช้งานได้" },
  { id: "AST006", asset_name: "โต๊ะทำงานไม้", asset_number: "TBL-CE201-10", category_id: "CAT006", brand: "IKEA", model: "LINNMON / ADILS", serial_number: "IK001001", location_id: "LOC005", status: "ชำรุดเล็กน้อย" },
  { id: "AST007", asset_name: "หลอดไฟ LED T8", asset_number: "LHT-CE301-03", category_id: "CAT007", brand: "Philips", model: "LEDtube", serial_number: "PHL77889", location_id: "LOC001", status: "ใช้งานได้" },
  { id: "AST008", asset_name: "ไมโครโฟนไร้สาย Shure", asset_number: "MIC-MH-01", category_id: "CAT008", brand: "Shure", model: "SM58 Wireless", serial_number: "SHU12121", location_id: "LOC007", status: "ใช้งานได้" },
  { id: "AST009", asset_name: "สุขภัณฑ์ American Standard", asset_number: "RES-MR3-01", category_id: "CAT009", brand: "American Standard", model: "TF-2023", serial_number: "AMST3344", location_id: "LOC009", status: "ใช้งานได้" },
  { id: "AST010", asset_name: "รถยนต์ส่วนกลาง Toyota Corolla", asset_number: "VEH-KMITL-01", category_id: "CAT010", brand: "Toyota", model: "Corolla Altis", serial_number: "TYT55667", location_id: "LOC010", status: "ใช้งานได้" },
  { id: "AST011", asset_name: "Windows 10 Pro License", asset_number: "SW-PC302-01", category_id: "CAT011", brand: "Microsoft", model: "Windows 10 Pro", serial_number: "WINKEY1234", location_id: "LOC002", status: "ใช้งานได้" },
];

const raw_reports = [
  {
    id: "REP001", title: "เครื่องปรับอากาศไม่เย็น", description: "แอร์ในห้อง 301 ไม่มีความเย็นออกมาเลย มีแต่ลม", status: STATUS.PENDING,
    image_before_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC001", asset_id: "AST001", reporter_id: "USER001", technician_id: null,
    created_at: "2024-03-01T10:00:00Z", accepted_at: null, started_at: null, completed_at: null,
    progress: 0, work_notes: []
  },
  {
    id: "REP002", title: "โปรเจคเตอร์เปิดไม่ติด", description: "โปรเจคเตอร์ในห้อง 302 กดปุ่มเปิดแล้วไม่มีอะไรเกิดขึ้น", status: STATUS.APPROVED,
    image_before_url: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC002", asset_id: "AST002", reporter_id: "USER003", technician_id: "USER010",
    created_at: "2024-03-02T11:00:00Z", accepted_at: "2024-03-02T12:00:00Z", started_at: null, completed_at: null,
    progress: 0, work_notes: [{ timestamp: "2024-03-02T12:00:00Z", note: "รับงานตรวจสอบโปรเจคเตอร์" }]
  },
  {
    id: "REP003", title: "จอคอมพิวเตอร์เสีย", description: "จอคอมพิวเตอร์ในห้อง 301 (PC-CE301-05) แสดงผลเป็นเส้น", status: STATUS.IN_PROGRESS,
    image_before_url: "https://images.unsplash.com/photo-1629854747065-4299446d5c27?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC001", asset_id: "AST003", reporter_id: "USER004", technician_id: "USER010",
    created_at: "2024-03-03T09:30:00Z", accepted_at: "2024-03-03T10:00:00Z", started_at: "2024-03-03T10:30:00Z", completed_at: null,
    progress: 50, work_notes: [{ timestamp: "2024-03-03T10:00:00Z", note: "รับงานตรวจสอบจอคอมพิวเตอร์" }, { timestamp: "2024-03-03T10:30:00Z", note: "เริ่มดำเนินการตรวจสอบสาเหตุ" }]
  },
  {
    id: "REP004", title: "เครื่องพิมพ์กระดาษติด", description: "เครื่องพิมพ์ HP ในห้อง 401 กระดาษติดบ่อยครั้ง", status: STATUS.COMPLETED,
    image_before_url: "https://images.unsplash.com/photo-1596707323145-81676f4e2417?auto=format&fit=crop&w=1400&q=60", image_after_url: "https://images.unsplash.com/photo-1596707323145-81676f4e2417?auto=format&fit=crop&w=1400&q=60",
    location_id: "LOC003", asset_id: "AST004", reporter_id: "USER006", technician_id: "USER010",
    created_at: "2024-03-04T13:00:00Z", accepted_at: "2024-03-04T13:30:00Z", started_at: "2024-03-04T14:00:00Z", completed_at: "2024-03-04T15:00:00Z",
    progress: 100, work_notes: [{ timestamp: "2024-03-04T13:30:00Z", note: "รับงานแก้ไขเครื่องพิมพ์" }, { timestamp: "2024-03-04T14:00:00Z", note: "เริ่มดำเนินการ แก้ไขปัญหาการติดกระดาษ" }, { timestamp: "2024-03-04T15:00:00Z", note: "ดำเนินการเสร็จสิ้น ทดสอบแล้วใช้งานได้ปกติ" }]
  },
  {
    id: "REP005", title: "ปลั๊กไฟชำรุด", description: "ปลั๊กไฟผนังในห้อง 201 ไม่มีไฟออก", status: STATUS.PENDING,
    image_before_url: "https://images.unsplash.com/photo-1621213768297-f5e9b8f2c69c?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC005", asset_id: "AST007", reporter_id: "USER007", technician_id: null,
    created_at: "2024-03-05T08:45:00Z", accepted_at: null, started_at: null, completed_at: null,
    progress: 0, work_notes: []
  },
  {
    id: "REP006", title: "เก้าอี้ห้องเรียนหัก", description: "เก้าอี้ไม้ในห้อง 201 ชำรุด ขาหัก 1 ตัว", status: STATUS.APPROVED,
    image_before_url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC005", asset_id: "AST006", reporter_id: "USER008", technician_id: "USER010",
    created_at: "2024-03-06T14:15:00Z", accepted_at: "2024-03-06T14:30:00Z", started_at: null, completed_at: null,
    progress: 0, work_notes: [{ timestamp: "2024-03-06T14:30:00Z", note: "รับงานซ่อมเก้าอี้" }]
  },
  {
    id: "REP007", title: "Router ห้อง Server ไม่ทำงาน", description: "ไม่สามารถเชื่อมต่ออินเทอร์เน็ตในห้อง Server ได้", status: STATUS.IN_PROGRESS,
    image_before_url: "https://images.unsplash.com/photo-1587840228468-b80c3e6608f5?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC006", asset_id: "AST005", reporter_id: "USER002", technician_id: "USER010",
    created_at: "2024-03-07T09:00:00Z", accepted_at: "2024-03-07T09:15:00Z", started_at: "2024-03-07T09:45:00Z", completed_at: null,
    progress: 20, work_notes: [{ timestamp: "2024-03-07T09:15:00Z", note: "รับงานตรวจสอบ Router" }, { timestamp: "2024-03-07T09:45:00Z", note: "เริ่มดำเนินการ ตรวจสอบการเชื่อมต่อ" }]
  },
  {
    id: "REP008", title: "ไมโครโฟนห้องประชุมเสียงไม่ชัด", description: "ไมโครโฟนในห้องประชุมใหญ่มีเสียงซ่า ไม่ชัดเจน", status: STATUS.PENDING,
    image_before_url: "https://images.unsplash.com/photo-1531636173431-77833593b4f6?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC007", asset_id: "AST008", reporter_id: "USER005", technician_id: null,
    created_at: "2024-03-08T10:30:00Z", accepted_at: null, started_at: null, completed_at: null,
    progress: 0, work_notes: []
  },
  {
    id: "REP009", title: "น้ำรั่วจากชักโครก", description: "ชักโครกในห้องน้ำชาย ชั้น 3 มีน้ำรั่วซึมตลอดเวลา", status: STATUS.CANCELLED,
    image_before_url: "https://images.unsplash.com/photo-1549419137-023a1a3e6a6e?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC009", asset_id: "AST009", reporter_id: "USER009", technician_id: "USER011",
    created_at: "2024-03-09T16:00:00Z", accepted_at: "2024-03-09T16:15:00Z", started_at: null, completed_at: null,
    progress: 0, work_notes: [{ timestamp: "2024-03-09T16:15:00Z", note: "รับงานตรวจสอบน้ำรั่ว" }, { timestamp: "2024-03-09T16:30:00Z", note: "ไม่สามารถดำเนินการได้ ต้องรออะไหล่" }]
  },
  {
    id: "REP010", title: "รถยนต์ส่วนกลางสตาร์ทไม่ติด", description: "รถยนต์ส่วนกลางจอดอยู่ที่ภาควิชา สตาร์ทไม่ติด", status: STATUS.PENDING,
    image_before_url: "https://images.unsplash.com/photo-1557999710-d0922883f3e8?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC010", asset_id: "AST010", reporter_id: "USER002", technician_id: null,
    created_at: "2024-03-10T09:00:00Z", accepted_at: null, started_at: null, completed_at: null,
    progress: 0, work_notes: []
  },
  {
    id: "REP011", title: "โปรแกรม Adobe Photoshop ใช้งานไม่ได้", description: "โปรแกรม Adobe Photoshop ในห้อง 302 เปิดแล้วค้าง", status: STATUS.APPROVED,
    image_before_url: "https://images.unsplash.com/photo-1599863261642-16e6d3090623?auto=format&fit=crop&w=1400&q=60", image_after_url: null,
    location_id: "LOC002", asset_id: "AST011", reporter_id: "USER001", technician_id: "USER010",
    created_at: "2024-03-11T13:00:00Z", accepted_at: "2024-03-11T13:30:00Z", started_at: null, completed_at: null,
    progress: 0, work_notes: [{ timestamp: "2024-03-11T13:30:00Z", note: "รับงานตรวจสอบปัญหาซอฟต์แวร์" }]
  },
];

export const repair_costs = [
  { id: "COST001", report_id: "REP004", item_name: "ตลับหมึกเครื่องพิมพ์", quantity: 1, unit_price: 1200, total_price: 1200, supplier: "IT House", note: "เปลี่ยนตลับหมึกสีดำ" },
  { id: "COST002", report_id: "REP004", item_name: "ค่าบริการช่าง", quantity: 1, unit_price: 500, total_price: 500, supplier: "ช่างภายใน", note: "ค่าตรวจสอบและแก้ไข" },
  { id: "COST003", report_id: "REP003", item_name: "หน้าจอ Dell 24 นิ้ว", quantity: 1, unit_price: 3500, total_price: 3500, supplier: "Advice", note: "เปลี่ยนจอใหม่เนื่องจากเสียหายหนัก" },
  { id: "COST004", report_id: "REP003", item_name: "สาย HDMI", quantity: 1, unit_price: 150, total_price: 150, supplier: "Banana IT", note: "เปลี่ยนสายสัญญาณ" },
  { id: "COST005", report_id: "REP001", item_name: "น้ำยาแอร์ R32", quantity: 2, unit_price: 800, total_price: 1600, supplier: "ร้านแอร์เจริญ", note: "เติมน้ำยาแอร์" },
  { id: "COST006", report_id: "REP001", item_name: "ค่าแรงช่างแอร์", quantity: 1, unit_price: 700, total_price: 700, supplier: "ช่างภายนอก", note: "ค่าบริการตรวจสอบและซ่อม" },
  { id: "COST007", report_id: "REP006", item_name: "ไม้เนื้อแข็งสำหรับซ่อม", quantity: 1, unit_price: 250, total_price: 250, supplier: "ร้านไม้ไทย", note: "ซ่อมขาเก้าอี้" },
  { id: "COST008", report_id: "REP006", item_name: "กาวอีพ็อกซี่", quantity: 1, unit_price: 120, total_price: 120, supplier: "HomePro", note: "ยึดโครงสร้างเก้าอี้" },
  { id: "COST009", report_id: "REP007", item_name: "สาย LAN Cat6", quantity: 1, unit_price: 80, total_price: 80, supplier: "JIB", note: "เปลี่ยนสาย LAN ที่ชำรุด" },
  { id: "COST010", report_id: "REP002", item_name: "หลอดโปรเจคเตอร์", quantity: 1, unit_price: 2500, total_price: 2500, supplier: "Epson Service", note: "เปลี่ยนหลอดภาพโปรเจคเตอร์" },
  { id: "COST011", report_id: "REP009", item_name: "ชุดลูกลอยชักโครก", quantity: 1, unit_price: 350, total_price: 350, supplier: "บุญถาวร", note: "เปลี่ยนชุดลูกลอยที่เสีย" },
];

export const addRepairCost = (reportId, costItem) => {
  const newCost = {
    cost_id: crypto.randomUUID(),
    report_id: reportId,
    ...costItem,
    created_at: new Date().toISOString()
  }
  repair_costs.push(newCost)
  return newCost
}

export const updateReportStatus = (reportId, status, completedAt = null) => {
  const report = reports.find(r => r.id === reportId);
  if (report) {
    report.status = status;
    if (completedAt) report.completed_at = completedAt;
  }
};



export const notifications = [
  { id: "NOT001", user_id: "USER001", title: "คำร้องของคุณ REP001 ถูกสร้างแล้ว", desc: "เราได้รับคำร้อง 'เครื่องปรับอากาศไม่เย็น' ของคุณแล้ว", type: "info", is_read: false, related_report_id: "REP001", create_at: "2024-03-01T10:05:00Z" },
  { id: "NOT002", user_id: "USER003", title: "คำร้อง REP002 ได้รับการอนุมัติ", desc: "คำร้อง 'โปรเจคเตอร์เปิดไม่ติด' ของคุณได้รับการอนุมัติแล้ว", type: "success", is_read: false, related_report_id: "REP002", create_at: "2024-03-02T12:05:00Z" },
  { id: "NOT003", user_id: "USER010", title: "มีคำร้องใหม่ REP002 สำหรับคุณ", desc: "โปรเจคเตอร์เปิดไม่ติดในห้อง 302", type: "warning", is_read: false, related_report_id: "REP002", create_at: "2024-03-02T12:06:00Z" },
  { id: "NOT004", user_id: "USER004", title: "คำร้อง REP003 อยู่ระหว่างดำเนินการ", desc: "คำร้อง 'จอคอมพิวเตอร์เสีย' ของคุณกำลังดำเนินการแก้ไข", type: "info", is_read: true, related_report_id: "REP003", create_at: "2024-03-03T10:35:00Z" },
  { id: "NOT005", user_id: "USER010", title: "อัปเดตสถานะ REP003", desc: "เริ่มดำเนินการตรวจสอบจอคอมพิวเตอร์ในห้อง 301", type: "info", is_read: false, related_report_id: "REP003", create_at: "2024-03-03T10:36:00Z" },
  { id: "NOT006", user_id: "USER006", title: "คำร้อง REP004 เสร็จสมบูรณ์", desc: "คำร้อง 'เครื่องพิมพ์กระดาษติด' ของคุณได้รับการแก้ไขเรียบร้อยแล้ว", type: "success", is_read: false, related_report_id: "REP004", create_at: "2024-03-04T15:05:00Z" },
  { id: "NOT007", user_id: "USER007", title: "คำร้องของคุณ REP005 ถูกสร้างแล้ว", desc: "เราได้รับคำร้อง 'ปลั๊กไฟชำรุด' ของคุณแล้ว", type: "info", is_read: false, related_report_id: "REP005", create_at: "2024-03-05T08:50:00Z" },
  { id: "NOT008", user_id: "USER008", title: "คำร้อง REP006 ได้รับการอนุมัติ", desc: "คำร้อง 'เก้าอี้ห้องเรียนหัก' ของคุณได้รับการอนุมัติแล้ว", type: "success", is_read: true, related_report_id: "REP006", create_at: "2024-03-06T14:35:00Z" },
  { id: "NOT009", user_id: "USER002", title: "คำร้อง REP007 อยู่ระหว่างดำเนินการ", desc: "คำร้อง 'Router ห้อง Server ไม่ทำงาน' ของคุณกำลังดำเนินการแก้ไข", type: "info", is_read: false, related_report_id: "REP007", create_at: "2024-03-07T09:50:00Z" },
  { id: "NOT010", user_id: "USER009", title: "คำร้อง REP009 ถูกยกเลิก", desc: "คำร้อง 'น้ำรั่วจากชักโครก' ของคุณถูกยกเลิกเนื่องจากต้องรออะไหล่", type: "error", is_read: false, related_report_id: "REP009", create_at: "2024-03-09T16:40:00Z" },
  { id: "NOT011", user_id: "USER001", title: "คำร้อง REP011 ได้รับการอนุมัติ", desc: "คำร้อง 'โปรแกรม Adobe Photoshop ใช้งานไม่ได้' ของคุณได้รับการอนุมัติแล้ว", type: "success", is_read: false, related_report_id: "REP011", create_at: "2024-03-11T13:35:00Z" },
];

const calculateStats = (reports) => {
  const pendingCount = reports.filter(r => r.status === STATUS.PENDING).length;
  const approvedCount = reports.filter(r => r.status === STATUS.APPROVED).length;
  const inProgressCount = reports.filter(r => r.status === STATUS.IN_PROGRESS).length;
  const completedCount = reports.filter(r => r.status === STATUS.COMPLETED).length;

  return [
    { labelTH: "รอรับงาน", labelEN: "Pending", value: pendingCount, pill: "PENDING", tone: "muted", icon: pending },
    { labelTH: "อนุมัติ", labelEN: "Approved", value: approvedCount, pill: "APPROVED", tone: "warn", icon: new_work },
    { labelTH: "กำลังดำเนินการ", labelEN: "In Progress", value: inProgressCount, pill: "IN_PROGRESS", tone: "progress", icon: progress },
    { labelTH: "เสร็จสิ้น", labelEN: "Completed", value: completedCount, pill: "COMPLETED", tone: "ok", icon: finish },
  ];
};

// Helper function to enrich reports with data from other mock arrays
const enrichReports = (reports, users, locations, assets, asset_categories) => {
  return reports.map(report => {
    const reporterUser = users.find(user => user.id === report.reporter_id);
    const technicianUser = users.find(user => user.id === report.technician_id);
    const location = locations.find(loc => loc.id === report.location_id);
    const asset = assets.find(a => a.id === report.asset_id);
    const assetCategory = asset_categories.find(cat => cat.id === asset?.category_id);

    const createdDate = new Date(report.created_at);
    const dateTH = createdDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const dateEN = createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    return {
      ...report,
      img: report.image_before_url, // Use image_before_url as img
      titleTH: report.title, // Assuming title is in Thai
      titleEN: report.title, // For simplicity, using title for both TH/EN
      locationTH: location ? `${location.location_name}` : 'N/A',
      locationEN: location ? `${location.building}, Floor ${location.floor}, Room ${location.room}` : 'N/A',
      reporter: reporterUser ? reporterUser.full_name : 'Unknown Reporter',
      tel: reporterUser ? reporterUser.phone : 'N/A',
      dateTH: dateTH,
      dateEN: dateEN,
      assetNo: asset ? asset.asset_number : 'N/A',
      typeTH: assetCategory ? assetCategory.type_name : 'N/A',
      assigned: technicianUser ? technicianUser.full_name : 'Unassigned',
    };
  });
};

export const reports = enrichReports(raw_reports, users, locations, assets, asset_categories);

export const stats = calculateStats(reports);

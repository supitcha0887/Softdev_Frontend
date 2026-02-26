import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pill } from "../../components/UI.jsx";
import { reports, STATUS, statusTone } from "../../../data/mock.js";

const TABS = [
  { key: "all", label: "ทั้งหมด / All", count: reports.length },
  { key: "new", label: "ใหม่ / New", count: reports.filter(r => r.status === STATUS.PENDING).length },
  { key: "progress", label: "กำลังดำเนินการ / In Progress", count: reports.filter(r => r.status === STATUS.IN_PROGRESS).length },
  { key: "done", label: "เสร็จสิ้น / Completed", count: reports.filter(r => r.status === STATUS.COMPLETED).length },
  { key: "cancelled", label: "ยกเลิก / Cancelled", count: reports.filter(r => r.status === STATUS.CANCELLED).length },
];

export default function ManageRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
        let items = [...reports];

    if (activeTab === "new") items = items.filter((i) => i.status === STATUS.PENDING);
    if (activeTab === "progress") items = items.filter((i) => i.status === STATUS.IN_PROGRESS);
    if (activeTab === "done") items = items.filter((i) => i.status === STATUS.COMPLETED);
    if (activeTab === "cancelled") items = items.filter((i) => i.status === STATUS.CANCELLED);

    if (status) items = items.filter((i) => i.status === status);
    if (location) items = items.filter((i) => i.locationTH.includes(location));
    if (type) items = items.filter((i) => i.typeTH.includes(type));

    if (sort === "oldest") items.reverse();
    if (sort === "status") {
      const order = {

        [STATUS.PENDING]: 1,
        [STATUS.IN_PROGRESS]: 2,
        [STATUS.COMPLETED]: 3,
        [STATUS.CANCELLED]: 4,
      };
      items.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
    }

    return items;
  }, [activeTab, status, location, type, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => {
    setStatus("");
    setLocation("");
    setType("");
    setSort("latest");
    setPage(1);
  };

  return (
    <>
      <section className="hero hero-manage">
        <h1>จัดการคำขอซ่อม / Manage Repair Requests</h1>
        <p>ระบบจัดการและติดตามคำขอซ่อมบำรุงทั้งหมด</p>
      </section>

      <main className="container">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(t.key);
                setPage(1);
              }}
              type="button"
            >
              {t.label} <span className="tab-count">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="filters">
          <div className="filters-row">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">สถานะ / Status</option>
              <option value={STATUS.PENDING}>{STATUS.PENDING}</option>
              <option value={STATUS.IN_PROGRESS}>{STATUS.IN_PROGRESS}</option>
              <option value={STATUS.COMPLETED}>{STATUS.COMPLETED}</option>
              <option value={STATUS.CANCELLED}>{STATUS.CANCELLED}</option>
            </select>

            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">สถานที่ / Location</option>
              <option value="อาคาร A">อาคาร A</option>
              <option value="อาคาร B">อาคาร B</option>
              <option value="อาคาร C">อาคาร C</option>
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">ประเภท / Type</option>
              <option value="แอร์">แอร์</option>
              <option value="โสต">โสตฯ</option>
              <option value="อาคาร">อาคาร</option>
              <option value="เฟอร์นิเจอร์">เฟอร์นิเจอร์</option>
            </select>

            <div className="date-range">
              <input type="date" aria-label="from date" />
              <span className="to">to</span>
              <input type="date" aria-label="to date" />
            </div>
          </div>

          <div className="filters-row bottom">
            <button className="link-danger" type="button" onClick={reset}>
              ✖ ล้างตัวกรอง
            </button>

            <div className="sort">
              <span>(เรียงตาม)</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">ใหม่ล่าสุด / Newest</option>
                <option value="oldest">เก่าสุด / Oldest</option>
                <option value="status">ตามสถานะ / Status</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid">
          {current.map((item) => (
            <article key={item.id} className="card">
              <div className="card-img">
                <img src={item.img} alt={item.titleEN} />
              </div>

              <div className="card-body">
                <div className="card-top">
                  <div>
                    <div className="card-title">{item.titleTH}</div>
                    <div className="card-sub">{item.locationTH}</div>
                  </div>
                  <Pill tone={statusTone(item.status)}>{item.status}</Pill>
                </div>

                <div className="card-meta">
                  <span className="muted">{item.id}</span>
                  <span className="muted">{item.dateTH}</span>
                </div>

                <Link className="btn-danger" to={`/requests/${item.id}`}>
                  ดูรายละเอียด
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="list-footer">
          <div className="muted">
            แสดง {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} จาก{" "}
            {filtered.length} รายการ
          </div>

          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              type="button"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).slice(0, 6).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`page-num ${page === p ? "active" : ""}`}
                  onClick={() => setPage(p)}
                  type="button"
                >
                  {p}
                </button>
              );
            })}

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

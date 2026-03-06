import React, { useState, useMemo ,useEffect} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/UI";
// import { reports as mockReports, addRepairCost } from "../../../data/mock";
import styles from "./CostLogging.module.css";

// Simple SVG Icon for the empty state
const EmptyIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.emptyIcon}
  >
    <path
      d="M9 7H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-2"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 3H19a2 2 0 012 2v13.5a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5V8.5a.5.5 0 01.5-.5H19"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export default function CostLogging() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API}/AdminManage/repair-requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Report not found");

        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const [costItems, setCostItems] = useState([]);
  const [newItem, setNewItem] = useState({
    item_name: "",
    quantity: 1,
    unit_price: "",
    supplier: "",
    note: "",
  });

  const totalCost = useMemo(() => {
    return costItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  }, [costItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.item_name || newItem.unit_price <= 0) {
      alert("Please fill in at least Item Name and Unit Price.");
      return;
    }

    const total_price = newItemTotalPrice;

    const itemToAdd = {
      ...newItem,
      id: new Date().getTime(), // temp id
      report_id: id,
      total_price,
    };

    setCostItems((prev) => [...prev, itemToAdd]);
    // Reset form
    setNewItem({
      item_name: "",
      quantity: 1,
      unit_price: "",
      supplier: "",
      note: "",
    });
  };

  const handleRemoveItem = (itemId) => {
    setCostItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSaveAndContinue = async () => {
    try {
      const token = localStorage.getItem("token");

      if (costItems.length > 0) {
        const res = await fetch(
          `${API}/AdminAsset/repair-requests/${id}/costs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: costItems.map((item) => ({
                itemName: item.item_name,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unit_price),
                supplier: item.supplier || "",
                note: item.note || "",
              })),
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to save costs");

        const data = await res.json();

        alert(data.message || "บันทึกรายการค่าใช้จ่ายเรียบร้อย");
      }

      navigate(`/requests/${id}/close-job`);
    } catch (err) {
      alert(err.message);
    }
  };

  const newItemTotalPrice = (parseFloat(newItem.quantity) || 0) * (parseFloat(newItem.unit_price) || 0);

  if (!report) {
    return (
      <main className="container">
        <Card>
          <h2>Report not found</h2>
          <Link to="/requests">Back to list</Link>
        </Card>
      </main>
    );
  }

  return (
    <>
      <section className="hero hero-manage">
        <h1>บันทึกค่าใช้จ่าย / Cost Logging System</h1>
        <p>
          Request ID: #{report.id} &bull; {report.titleTH || report.title}
        </p>
      </section>

      <main className={`container ${styles.mainContainer}`}>
        {/* Section 1: Add Item Form */}
        <Card>
          <div className={styles.cardHeader}>
            <h2>เพิ่มรายการค่าใช้จ่าย</h2>
            <button className={styles.addItemBtn} onClick={handleAddItem}>+ เพิ่มรายการ</button>
          </div>
          <form className={styles.formGrid} onSubmit={handleAddItem}>
            {/* Row 1 */}
            <div className={styles.formGroup}>
              <label htmlFor="item_name">ชื่อรายการ</label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={newItem.item_name}
                onChange={handleInputChange}
                placeholder="เช่น สายไฟ, น็อต"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantity">จำนวน</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="unit_price">ราคาต่อหน่วย</label>
              <input
                type="number"
                id="unit_price"
                name="unit_price"
                value={newItem.unit_price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label>รวม</label>
              <input
                type="text"
                value={newItemTotalPrice.toFixed(2)}
                disabled
                className={styles.disabledInput}
              />
            </div>
            <button type="submit" className={styles.confirmBtn}>✓</button>

            {/* Row 2 */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="supplier">ผู้จำหน่าย</label>
                <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={newItem.supplier}
                    onChange={handleInputChange}
                    placeholder="ชื่อร้าน/บริษัท"
                />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="note">หมายเหตุ</label>
                <input
                    type="text"
                    id="note"
                    name="note"
                    value={newItem.note}
                    onChange={handleInputChange}
                    placeholder="เลขที่ใบเสร็จ หรือ หมายเหตุเพิ่มเติม"
                />
            </div>
          </form>
        </Card>

        {/* Section 2: Cost Items List */}
        <Card>
            <div className={styles.cardHeader}>
                <h2>รายการค่าใช้จ่าย</h2>
            </div>
            {costItems.length === 0 ? (
                <div className={styles.emptyState}>
                    <EmptyIcon />
                    <h3>ยังไม่มีรายการค่าใช้จ่าย</h3>
                    <p>เริ่มต้นโดยการเพิ่มรายการแรกของคุณ</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.costTable}>
                        <thead>
                            <tr>
                                <th>ชื่อรายการ</th>
                                <th>จำนวน</th>
                                <th>ราคาต่อหน่วย</th>
                                <th>รวม</th>
                                <th>ผู้จำหน่าย</th>
                                <th>หมายเหตุ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {costItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.item_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit_price}</td>
                                    <td>{item.total_price.toFixed(2)}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.note}</td>
                                    <td>
                                        <button className={styles.deleteBtn} onClick={() => handleRemoveItem(item.id)}>
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>

        {/* Section 3: Summary */}
        <Card className={styles.summaryCard}>
            <div className={styles.summaryContent}>
                 <div>
                    <h2>สรุปค่าใช้จ่ายรวม</h2>
                    <p>Total Cost Summary</p>
                </div>
                <div className={styles.totalAmount}>
                    ฿{totalCost.toFixed(2)}
                    <span>THB</span>
                </div>
            </div>
            <button className={styles.saveBtn} onClick={handleSaveAndContinue}>
                บันทึกและดำเนินการต่อ
                <span>Save and Continue</span>
            </button>
        </Card>
      </main>
    </>
  );
}
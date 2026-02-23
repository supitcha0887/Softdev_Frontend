import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { reports as mockReports } from '../../../data/mock';
import { Card, Pill } from '../../components/UI';
import styles from './UpdateProgress.module.css';

// Mock icons for meta details, replace with actual icons if available
const LocationIcon = () => '📍';
const UserIcon = () => '👤';
const CalendarIcon = () => '📅';
const CategoryIcon = () => '🏷️';
const DocIcon = () => '📄';

const CHECKLIST_ITEMS = [
    "ตรวจสอบเบื้องต้น",
    "ตรวจสอบระบบไฟฟ้า",
    "เปลี่ยนชิ้นส่วนที่ชำรุด",
    "ทดสอบการทำงาน",
    "ทำความสะอาดและปิดงาน"
];

const STATUS_TH = {
    "pending": "รอรับงาน",
    "approved": "อนุมัติแล้ว",
    "in_progress": "กำลังดำเนินการ",
    "completed": "เสร็จสิ้น",
    "cancelled": "ยกเลิก",
};

// Map status to CSS module class
const statusToDotClass = {
    "pending": styles.pending,
    "approved": styles.approved,
    "in_progress": styles.in_progress,
    "completed": styles.completed,
    "cancelled": styles.cancelled,
};


export default function UpdateProgress() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const report = useMemo(() => mockReports.find(r => r.id === id), [id]);

    const [status, setStatus] = useState(report?.status || '');
    const [workNotes, setWorkNotes] = useState('');
    const [checkedState, setCheckedState] = useState(
        new Array(CHECKLIST_ITEMS.length).fill(false)
    );
    const [progressHistory, setProgressHistory] = useState(report?.progress || []);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);


    const handleChecklistChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (.jpg, .jpeg, .png, .gif, .webp)");
                e.target.value = null;
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const checkedItems = CHECKLIST_ITEMS.filter((_, index) => checkedState[index]);
        
        const newProgress = {
            date: new Date().toISOString(),
            title: STATUS_TH[status] || "อัปเดตสถานะ",
            description: workNotes,
            by: "STAFF-0024", // Mock staff
            checklist: checkedItems,
            status: status,
        };

        setProgressHistory(prev => [...prev, newProgress]);

        // Reset form
        setWorkNotes('');
        setCheckedState(new Array(CHECKLIST_ITEMS.length).fill(false));
        setImageFile(null);
        setImagePreview(null);
        
        alert('อัปเดตความคืบหน้าสำเร็จ!');
    };

    if (!report) {
        return (
            <main className="container">
                <Card><h2>ไม่พบรายการ</h2><p>ไม่พบรายการแจ้งซ่อมที่คุณต้องการ</p><button onClick={() => navigate('/requests')}>ย้อนกลับ</button></Card>
            </main>
        );
    }
    
    // This is just for demonstration, you might get this from your status map
    const statusTone = (status) => {
        const tones = {
            "pending": 'warn',
            "in_progress": 'progress',
            "completed": 'ok',
            "cancelled": 'danger',
            "approved": 'new',
        };
        return tones[status] || 'default';
    }
    
    return (
        <>
            <section className="hero hero-manage">
                <h1>อัปเดตความคืบหน้าการซ่อม</h1>
                <p className="hero-sub">Update work progress and status</p>
            </section>
            <main className={`container ${styles.mainGrid}`}>
                {/* Left Panel */}
                <aside className={styles.leftPanel}>
                    <Card className={styles.reportCard}>
                        <img src={report.img} alt={report.titleEN} className={styles.reportImage} />
                        <div className={styles.reportId}>
                            <span>{report.id}</span>
                            <Pill tone={statusTone(report.status)}>{STATUS_TH[report.status]}</Pill>
                        </div>
                        <h2 className={styles.reportTitle}>{report.titleTH}</h2>
                        <div className={styles.reportMeta}>
                            <div className={styles.metaItem}><LocationIcon /> {report.locationTH}</div>
                            <div className={styles.metaItem}><UserIcon /> {report.reporter}</div>
                            <div className={styles.metaItem}><CalendarIcon /> {report.dateTH}</div>
                            <div className={styles.metaItem}><CategoryIcon /> {report.typeTH}</div>
                        </div>
                    </Card>
                </aside>

                {/* Center Panel */}
                <section className={styles.centerPanel}>
                    <Card className={styles.formCard}>
                        <form onSubmit={handleSubmit}>
                            <h2><DocIcon /> อัปเดตความคืบหน้า</h2>
                            <div className={styles.formGroup}>
                                <label htmlFor="work-status">สถานะงาน</label>
                                <select id="work-status" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="pending">รอรับงาน</option>
                                    <option value="approved">อนุมัติแล้ว</option>
                                    <option value="in_progress">กำลังดำเนินการ</option>
                                    <option value="completed">เสร็จสิ้น</option>
                                    <option value="cancelled">ยกเลิก</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="work-notes">บันทึกการทำงาน</label>
                                <textarea id="work-notes" rows="5" value={workNotes} onChange={e => setWorkNotes(e.target.value)}></textarea>
                            </div>
                            <div className={styles.formGroup}>
                                <label>ขั้นตอนการซ่อม</label>
                                <div className={styles.checklist}>
                                    {CHECKLIST_ITEMS.map((name, index) => (
                                        <label key={index} className={styles.checkItem}>
                                            <input
                                                type="checkbox"
                                                checked={checkedState[index]}
                                                onChange={() => handleChecklistChange(index)}
                                            />
                                            {name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="attach-photos">แนบรูปภาพ (ท้ายงาน)</label>
                                <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }}/>
                                    ) : (
                                        'คลิกเพื่ออัปโหลดรูปภาพ'
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    id="attach-photos" 
                                    style={{ display: 'none' }} 
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.saveButton}>บันทึกการอัปเดต</button>
                                <button type="button" className={styles.costButton} onClick={() => navigate(`/requests/${id}/cost-logging`)}>บันทึกค่าใช้จ่าย</button>
                                <button type="button" className={styles.backButton} onClick={() => navigate(`/requests/${id}`)}>ย้อนกลับ</button>
                            </div>
                        </form>
                    </Card>
                </section>
                
                {/* Right Panel */}
                <aside className={styles.rightPanel}>
                    <Card className={styles.historyCard}>
                        <h2>ประวัติการอัปเดต</h2>
                        <div className={styles.historyList}>
                            {progressHistory.map((item, index) => (
                                <div key={index} className={styles.historyItem}>
                                    <div className={`${styles.historyDot} ${statusToDotClass[item.status] || ''}`}></div>
                                    <p className={styles.historyDate}>{new Date(item.date).toLocaleString('th-TH')}</p>
                                    <h3 className={styles.historyTitle}>{STATUS_TH[item.status] || item.title}</h3>
                                    <p className={styles.historyDesc}>{item.description}</p>
                                    <p className={styles.historyBy}>โดย: {item.by}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </aside>
            </main>
        </>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReportPage.module.css';
import UserNavbar from '../../components/UserNavbar';
import Footer from '../../components/Footer';
import { supabase, getAccessToken } from '../../supabaseClient';
import { compressImage, formatFileSize } from '../../utils/imageUtils';
import { useNotification } from '../../contexts/NotificationContext';

function ReportPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const { showToast } = useNotification();
  const [imageFile, setImageFile] = useState(null);
  const [originalFileSize, setOriginalFileSize] = useState(null);
  const [compressedFileSize, setCompressedFileSize] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [assets, setAssets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [assetCategories, setAssetCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    asset_id: '',
    location_id: '',
    category_id: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase.from('locations').select('location_id, building, floor, room');
      if (locationsError) showToast('Error fetching locations: ' + locationsError.message, 'error');
      else setLocations(locationsData);

      // Fetch asset categories
      const { data: categoriesData, error: categoriesError } = await supabase.from('asset_categories').select('category_id, type_name');
      if (categoriesError) showToast('Error fetching asset categories: ' + categoriesError.message, 'error');
      else setAssetCategories(categoriesData);
    };

    fetchInitialData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      setOriginalFileSize(null);
      setCompressedFileSize(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (.jpg, .jpeg, .png, .gif, .webp)", "warning");
      e.target.value = null;
      return;
    }

    // 1. Check original file size limit
    if (file.size > 10 * 1024 * 1024) {
      showToast("ขนาดไฟล์ต้องไม่เกิน 10 MB กรุณาเลือกรูปใหม่", "warning");
      e.target.value = null;
      return;
    }

    setOriginalFileSize(formatFileSize(file.size));
    setImagePreview(URL.createObjectURL(file));
    setIsCompressing(true);

    try {
      const compressedFile = await compressImage(file, 10);
      setImageFile(compressedFile);
      setCompressedFileSize(formatFileSize(compressedFile.size));
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการบีบอัดรูปภาพ: " + error.message, "error");
      setImageFile(null);
      setImagePreview(null);
      setOriginalFileSize(null);
      setCompressedFileSize(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocationId = e.target.value;
    setFormData(prev => ({
      ...prev,
      location_id: selectedLocationId,
      category_id: '', // Reset category
      asset_id: '',      // Reset asset
    }));
    setAssets([]); // Clear previous assets
  };
  
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setFormData(prev => ({
      ...prev,
      category_id: selectedCategoryId,
      asset_id: '', // Reset asset when category changes
    }));
    setAssets([]); // Clear previous assets

    if (formData.location_id && selectedCategoryId) {
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('asset_id, asset_name, asset_number')
        .eq('location_id', formData.location_id)
        .eq('category_id', selectedCategoryId)
        .eq('status', 'active');
      
      if (assetsError) showToast('Error fetching assets: ' + assetsError.message, 'error');
      else setAssets(assetsData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'กรุณากรอกหัวข้อ';
    if (!formData.location_id) newErrors.location_id = 'กรุณาเลือกสถานที่';
    if (!formData.category_id) newErrors.category_id = 'กรุณาเลือกประเภทอุปกรณ์';
    if (!formData.asset_id) newErrors.asset_id = 'กรุณาเลือกครุภัณฑ์';
    if (!imageFile) newErrors.image = 'กรุณาอัพโหลดรูปภาพ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // 1. Image Upload
    let imageUrl = '';
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from('report-images')
        .upload(`${Date.now()}_${imageFile.name}`, imageFile);

      if (error) {
        showToast('Failed to upload image: ' + error.message, 'error');
        setLoading(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('report-images').getPublicUrl(data.path);
      imageUrl = publicUrl;
    }

    // 2. Fetch user phone
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('phone')
      .eq('user_id', user.id)
      .single();

    if (userError) {
      showToast('Could not retrieve user details: ' + userError.message, 'error');
      setLoading(false);
      return;
    }

    // 3. Send to API
    const token = await getAccessToken();
    const reportData = {
      title: formData.title,
      assetId: formData.asset_id,
      locationId: formData.location_id,
      description: formData.description,
      contactPhone: userData.phone || 'N/A',
      imageUrl: imageUrl,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Report/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        showToast('แจ้งซ่อมสำเร็จ!', 'success');
        navigate('/home');
      } else {
        const text = await response.text();
        showToast('Failed to submit report: ' + text, 'error');
      }
    } catch (error) {
      showToast('Cannot connect to the server: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.pageContainer}>
      <UserNavbar />
      <div className={styles.heroSection}>
        <div className={styles.waveTop}></div>
        <div className={styles.waveBottom}></div>
        <div className={styles.heroContent}>
          <h1>รายงานครุภัณฑ์เสียหายภายใน</h1>
          <p>ภาควิชาคอมพิวเตอร์ อาคาร ECC</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formCard}>
          <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
            <input type="file" id="fileUpload" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/jpeg,image/png,image/gif,image/webp" />
            {imagePreview ? <img src={imagePreview} alt="Preview" className={styles.imagePreview} /> : 'อัพโหลดรูปภาพ'}
            {isCompressing && (
              <div className={styles.loadingOverlay}>
                <span>กำลังย่อขนาดรูปภาพ...</span>
              </div>
            )}
          </div>
          {originalFileSize && (
            <p className={styles.fileInfo}>
              ขนาดไฟล์: {originalFileSize} {compressedFileSize && `→ ${compressedFileSize}`}
            </p>
          )}
          {errors.image && <p className={styles.error}>{errors.image}</p>}

          <div className={styles.inputGroup}>
            <input type="text" name="title" placeholder="หัวข้อการแจ้ง" value={formData.title} onChange={handleChange} />
            <span className={styles.required}>*</span>
          </div>
          {errors.title && <p className={styles.error}>{errors.title}</p>}

          <div className={styles.inputGroup}>
            <select name="location_id" value={formData.location_id} onChange={handleLocationChange}>
              <option value="">เลือกห้อง/สถานที่</option>
              {locations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.building} {loc.floor} {loc.room}
                </option>
              ))}
            </select>
            <span className={styles.required}>*</span>
          </div>
          {errors.location_id && <p className={styles.error}>{errors.location_id}</p>}

          <div className={styles.inputGroup}>
            <select name="category_id" value={formData.category_id} onChange={handleCategoryChange} disabled={!formData.location_id}>
              <option value="">{!formData.location_id ? "กรุณาเลือกสถานที่ก่อน" : "เลือกประเภทอุปกรณ์"}</option>
              {assetCategories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.type_name}
                </option>
              ))}
            </select>
            <span className={styles.required}>*</span>
          </div>
          {errors.category_id && <p className={styles.error}>{errors.category_id}</p>}

          <div className={styles.inputGroup}>
            <select name="asset_id" value={formData.asset_id} onChange={handleChange} disabled={!formData.location_id || !formData.category_id}>
              <option value="">{!formData.category_id ? "กรุณาเลือกประเภทก่อน" : "เลือกอุปกรณ์"}</option>
              {assets.map(asset => (
                <option key={asset.asset_id} value={asset.asset_id}>
                  {asset.asset_name} ({asset.asset_number})
                </option>
              ))}
            </select>
            <span className={styles.required}>*</span>
          </div>
          {errors.asset_id && <p className={styles.error}>{errors.asset_id}</p>}
          
          <div className={styles.inputGroup}>
            <textarea name="description" placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" rows="4" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={loading || isCompressing}>
              {loading ? 'กำลังส่ง...' : 'ยืนยัน'}
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default ReportPage;

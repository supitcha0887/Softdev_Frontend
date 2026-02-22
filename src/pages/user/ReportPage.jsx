import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReportPage.module.css';
import UserNavbar from '../../components/UserNavbar';
import Footer from '../../components/Footer';
import { supabase, getAccessToken } from '../../supabaseClient';

function ReportPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    asset_id: '',
    location_id: '',
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
      const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');
      if (locationsError) console.error('Error fetching locations:', locationsError);
      else setLocations(locationsData);
    };

    fetchInitialData();
  }, []);

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

  const handleLocationChange = async (e) => {
    const selectedLocationId = e.target.value;
    setFormData(prev => ({
      ...prev,
      location_id: selectedLocationId,
      asset_id: '', // Reset asset when location changes
    }));
    setAssets([]); // Clear previous assets

    if (selectedLocationId) {
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('asset_id, asset_name, asset_number')
        .eq('location_id', selectedLocationId);

      if (assetsError) console.error('Error fetching assets:', assetsError);
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
    if (!formData.asset_id) newErrors.asset_id = 'กรุณาเลือกครุภัณฑ์';
    if (!formData.description) newErrors.description = 'กรุณากรอกรายละเอียด';
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
        console.error('Error uploading image:', error);
        setErrors({ api: 'Failed to upload image.' });
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
      console.error('Error fetching user phone:', userError);
      setErrors({ api: 'Could not retrieve user details.' });
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
        alert('แจ้งซ่อมสำเร็จ!');
        navigate('/home');
      } else {
        const text = await response.text();
        console.error('API Error Text:', text);
        try {
          const errorData = JSON.parse(text);
          setErrors({ api: `Failed to submit report: ${errorData.message || 'Unknown error'}` });
        } catch (e) {
          setErrors({ api: `Failed to submit report: Server returned a non-JSON error.` });
        }
      }
    } catch (error) {
      console.error('Network or other error:', error);
      setErrors({ api: 'Cannot connect to the server.' });
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
          </div>
          {errors.image && <p className={styles.error}>{errors.image}</p>}

          <div className={styles.inputGroup}>
            <input type="text" name="title" placeholder="หัวข้อการแจ้ง" value={formData.title} onChange={handleChange} />
            <span className={styles.required}>*</span>
          </div>
          {errors.title && <p className={styles.error}>{errors.title}</p>}

          <div className={styles.inputGroup}>
            <select name="location_id" value={formData.location_id} onChange={handleLocationChange}>
              <option value="">สถานที่ ห้อง ณ ตึก ECC</option>
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
            <select name="asset_id" value={formData.asset_id} onChange={handleChange} disabled={!formData.location_id}>
              <option value="">{!formData.location_id ? "กรุณาเลือกสถานที่ก่อน" : "ค้นหาครุภัณฑ์"}</option>
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
            <textarea name="description" placeholder="รายละเอียดเพิ่มเติม" rows="4" value={formData.description} onChange={handleChange}></textarea>
            <span className={styles.required}>*</span>
          </div>
          {errors.description && <p className={styles.error}>{errors.description}</p>}

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
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

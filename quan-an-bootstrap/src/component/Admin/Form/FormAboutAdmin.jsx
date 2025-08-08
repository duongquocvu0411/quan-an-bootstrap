import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './../Page/Sidebar';
import { DarkModeContext } from './../DarkModeContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createAbout, getAboutById, updateAbout } from '../../../be/Admin/About/AboutAdmin.api';

const FormAboutAdmin = ({ mode }) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    descriptions: '',
    isActive: true,
    AboutDisplayOrder: '',
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: ''
  });

  const [oldImages, setOldImages] = useState([]);
  const [replacedOldImages, setReplacedOldImages] = useState({});
  const [deletedOldImageIds, setDeletedOldImageIds] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);

  useEffect(() => {
  const fetchDetail = async () => {
    if (mode !== 'add' && id) {
      const res = await getAboutById(id);
      if (res.isSuccess) {
        const data = res.data;
        setForm({
          id: data.id,
          descriptions: data.descriptions,
          isActive: data.isActive,
          AboutDisplayOrder: data.displayOrder ?? '',
          createdAt: data.createdAt,
          createdBy: data.createdBy,
          updatedAt: data.updatedAt,
          updatedBy: data.updatedBy
        });

        if (Array.isArray(data.images)) {
          setOldImages(data.images); //  Giữ lại ảnh cũ
          console.log(" Ảnh cũ nhận từ API:", data.images);
        } else {
          setOldImages([]);
        }
      } else {
        toast.error(res.message || 'Không lấy được chi tiết About');
      }
    }
  };

  fetchDetail();
}, [id, mode]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
    setDisplayOrders(prev => [...prev, ...files.map((_, idx) => prev.length + idx + 1)]);
  };

  const handleReplaceOldImage = (e, imgId) => {
    const file = e.target.files[0];
    if (file) {
      setReplacedOldImages(prev => ({ ...prev, [imgId]: file }));
    }
  };

  const handleRemoveNewImage = (index) => {
    const updatedFiles = [...newImages];
    const updatedPreviews = [...previewImages];
    const updatedOrders = [...displayOrders];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    updatedOrders.splice(index, 1);
    setNewImages(updatedFiles);
    setPreviewImages(updatedPreviews);
    setDisplayOrders(updatedOrders);
  };

  const handleDeleteOldImage = (imgId) => {
    setDeletedOldImageIds(prev => [...prev, imgId]);
    setOldImages(prev => prev.filter(img => img.id !== imgId));
    setReplacedOldImages(prev => {
      const updated = { ...prev };
      delete updated[imgId];
      return updated;
    });
  };

  const handleOldImageOrderChange = (imgId, value) => {
    setOldImages(prev => prev.map(img => img.id === imgId ? { ...img, displayOrder: parseInt(value) } : img));
  };

  const handleOrderChange = (index, value) => {
    const updatedOrders = [...displayOrders];
    updatedOrders[index] = parseInt(value);
    setDisplayOrders(updatedOrders);
  };

  //  Hàm convert ảnh URL thành File
 const fetchImageAsFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("Descriptions", form.descriptions);
    formData.append("IsActive", form.isActive);
    formData.append("AboutDisplayOrder", form.AboutDisplayOrder);

    const allImages = [];
    const allOrders = [];

    //  1. Ảnh cũ giữ lại → fetch thành File
    for (const img of oldImages) {
      const isDeleted = deletedOldImageIds.includes(img.id);
      const isReplaced = Object.keys(replacedOldImages).includes(String(img.id));

      if (!isDeleted && !isReplaced) {
        const file = await fetchImageAsFile(img.url, `old-${img.id}.jpg`);
        allImages.push(file);
        allOrders.push(img.displayOrder);
      }
    }

    //  2. Ảnh cũ bị thay thế → lấy file thay thế
    for (const [imgId, file] of Object.entries(replacedOldImages)) {
      const img = oldImages.find(x => x.id === parseInt(imgId));
      if (img && file) {
        allImages.push(file);
        allOrders.push(img.displayOrder);
      }
    }

    //  3. Ảnh mới
    newImages.forEach((file, i) => {
      allImages.push(file);
      allOrders.push(displayOrders[i]);
    });

    //  Gửi tất cả ảnh và thứ tự
    allImages.forEach((img, i) => {
      formData.append("Images", img);
      formData.append("DisplayOrders", allOrders[i]);
    });

    //  Debug log
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const res = mode === 'edit'
      ? await updateAbout(id, formData)
      : await createAbout(formData);

    if (res.isSuccess) {
      toast.success(`${mode === 'edit' ? 'Cập nhật' : 'Thêm mới'} thành công!`);
      setTimeout(() => navigate('/admin/about-admin'), 1500);
    } else {
      toast.error(res.message || 'Có lỗi xảy ra!');
    }
  } catch (err) {
    console.error(err);
    toast.error(err?.message || 'Lỗi không xác định!');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/admin/dashboard">Dashboard</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/admin/about-admin">Giới thiệu</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {mode === 'detail' ? 'Chi tiết' : mode === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}
            </li>
          </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">
            {mode === 'detail' ? 'Chi tiết Giới thiệu' : mode === 'edit' ? 'Chỉnh sửa Giới thiệu' : 'Thêm mới Giới thiệu'}
          </h4>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/about-admin')}>
            <i className="bi bi-arrow-left me-1"></i> Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-bold">Mô tả</label>
          <div className="ckeditor-wrapper" style={{ border: '1px solid #ced4da', borderRadius: '5px', padding: '10px' }}>
            <CKEditor
              editor={ClassicEditor}
              data={form.descriptions}
              disabled={mode === 'detail'}
              onChange={(event, editor) => {
                const data = editor.getData();
                setForm(prev => ({ ...prev, descriptions: data }));
              }}
              config={{ placeholder: 'Nhập nội dung mô tả...' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Thứ tự hiển thị</label>
            <input
              type="number"
              name="AboutDisplayOrder"
              className="form-control"
              value={form.AboutDisplayOrder}
              onChange={handleChange}
              disabled={mode === 'detail'}
              placeholder="Nhập thứ tự hiển thị"
            />
          </div>

          <div className="form-check form-switch my-3">
            <input type="checkbox" className="form-check-input" name="isActive" checked={form.isActive} onChange={handleChange} disabled={mode === 'detail'} />
            <label className="form-check-label">Trạng thái hoạt động</label>
          </div>

          {mode !== 'add' && oldImages.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-bold">Hình ảnh hiện tại</label>
              <div className="d-flex flex-wrap gap-3">
                {oldImages.map(img => (
                  <div key={img.id} className="text-center position-relative">
                    <img
                      src={replacedOldImages[img.id] ? URL.createObjectURL(replacedOldImages[img.id]) : img.url}
                      alt="old-img"
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <input
                      type="number"
                      className="form-control form-control-sm mt-1"
                      value={img.displayOrder}
                      onChange={(e) => handleOldImageOrderChange(img.id, e.target.value)}
                      style={{ width: '80px', margin: '0 auto' }}
                    />
                    <input type="file" onChange={(e) => handleReplaceOldImage(e, img.id)} className="form-control form-control-sm mt-1" />
                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => handleDeleteOldImage(img.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode !== 'detail' && (
            <div className="mb-3">
              <label className="form-label fw-bold">Thêm ảnh mới</label>
              <input type="file" multiple className="form-control" onChange={handleImageChange} accept="image/*" />
              <div className="d-flex flex-wrap gap-3 mt-2">
                {previewImages.map((img, i) => (
                  <div key={i} className="position-relative text-center">
                    <label style={{ cursor: 'pointer' }}>
                      <img
                        src={img}
                        alt={`preview-${i}`}
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ccc' }}
                        title="Click để thay ảnh"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newFileList = [...newImages];
                            const newPreviewList = [...previewImages];
                            newFileList[i] = file;
                            newPreviewList[i] = URL.createObjectURL(file);
                            setNewImages(newFileList);
                            setPreviewImages(newPreviewList);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-control form-control-sm mt-1"
                      value={displayOrders[i] || ''}
                      onChange={(e) => handleOrderChange(i, e.target.value)}
                      style={{ width: '80px', margin: '0 auto' }}
                    />
                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => handleRemoveNewImage(i)}>
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode !== 'detail' && (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Lưu'}
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormAboutAdmin;

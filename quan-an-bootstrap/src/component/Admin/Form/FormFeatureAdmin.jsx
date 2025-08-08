import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DarkModeContext } from '../DarkModeContext';
import Sidebar from '../Page/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { createFeatureAdmin, getFeatureById, updateFeatureAdmin } from '../../../be/Admin/Feature/FeatureAdmin.api';


const FormFeatureAdmin = ({ mode }) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    displayOrder: 1,
    isActive: true,
    imageFile: null,
    image: '',
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: ''
  });

  // Lấy dữ liệu nếu là edit hoặc detail
  useEffect(() => {
    if (mode === 'edit' || mode === 'detail') {
      const fetchData = async () => {
        try {
          const data = await getFeatureById(id);
          setForm({
            title: data.title || '',
            description: data.description || '',
            link: data.link || '',
            displayOrder: data.displayOrder || 1,
            isActive: data.isActive ?? true,
            imageFile: null,
            image: data.image || '',
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy
          });
        } catch (err) {
          toast.error('Không thể tải dữ liệu tính năng!');
        }
      };
      fetchData();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    if (mode === 'detail') return;
    const { name, value, type, checked, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const urlToFile = async (url, filename, mimeType) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('Title', form.title);
    formData.append('Description', form.description);
    formData.append('Link', form.link);
    formData.append('DisplayOrder', form.displayOrder);
    formData.append('IsActive', form.isActive);

    if (form.imageFile) {
      // Gửi ảnh mới nếu người dùng đã chọn
      formData.append('ImageFile', form.imageFile);
    } else if (form.image) {
      // Nếu không có ảnh mới, nhưng có URL ảnh cũ → convert sang File
      const oldFile = await urlToFile(form.image, 'old-image.jpg', 'image/jpeg');
      formData.append('ImageFile', oldFile);
    } else {
      toast.error('Vui lòng chọn ảnh minh hoạ!');
      return;
    }

    console.log('FormData gửi đi:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    let response;
    if (mode === 'add') {
      response = await createFeatureAdmin(formData);
    } else if (mode === 'edit') {
      response = await updateFeatureAdmin(id, formData);
    }

    if (response?.isSuccess) {
      toast.success(response.message || `${mode === 'add' ? 'Tạo mới' : 'Cập nhật'} thành công`);
      setTimeout(() => navigate('/admin/features'), 1000);
    } else {
      toast.error(response?.message || 'Thao tác thất bại');
    }
  } catch (err) {
    toast.error(err?.message || 'Đã xảy ra lỗi khi xử lý');
  } finally {
    setTimeout(() => setLoading(false), 1200);
  }
};





  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item"><a href="/admin/features">Đặc trưng</a></li>
            <li className="breadcrumb-item active" aria-current="page">
              {mode === 'detail' ? 'Chi tiết' : mode === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}
            </li>
          </ol>
        </nav>

        <h4 className="fw-bold mb-3">
          {mode === 'detail'
            ? 'Xem chi tiết tính năng'
            : mode === 'edit'
            ? 'Chỉnh sửa tính năng'
            : 'Thêm mới tính năng'}
        </h4>

        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Quay lại
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Tiêu đề</label>
            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              disabled={mode === 'detail'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Mô tả</label>
            <textarea
              name="description"
              rows={3}
              className="form-control"
              value={form.description}
              onChange={handleChange}
              disabled={mode === 'detail'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Link</label>
            <input
              name="link"
              className="form-control"
              value={form.link}
              onChange={handleChange}
              disabled={mode === 'detail'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Thứ tự hiển thị</label>
            <input
              type="number"
              name="displayOrder"
              className="form-control"
              value={form.displayOrder}
              onChange={handleChange}
              disabled={mode === 'detail'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Ảnh minh hoạ</label>

            {(mode === 'edit' || mode === 'detail') && form.image && (
                <div className="mb-2">
                <img
                    src={form.image}
                    alt="Ảnh hiện tại"
                    className="img-thumbnail"
                    style={{ width: 200 }}
                />
                </div>
            )}

            {mode !== 'detail' && (
                <input
                type="file"
                name="imageFile"
                className="form-control"
                onChange={handleChange}
                />
            )}
            </div>


          <div className="form-check form-switch mb-3">
            <input
              type="checkbox"
              name="isActive"
              className="form-check-input"
              checked={form.isActive}
              onChange={handleChange}
              disabled={mode === 'detail'}
            />
            <label className="form-check-label">Đang hoạt động</label>
          </div>

          {mode === 'detail' && (
            <div className="mb-3">
              <p><strong>Ngày tạo:</strong> {new Date(form.createdAt).toLocaleString()}</p>
              <p><strong>Người tạo:</strong> {form.createdBy}</p>
              <p><strong>Ngày cập nhật:</strong> {new Date(form.updatedAt).toLocaleString()}</p>
              <p><strong>Người cập nhật:</strong> {form.updatedBy}</p>
            </div>
          )}

          {mode !== 'detail' && (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-1"></i>
                  {mode === 'edit' ? 'Cập nhật' : 'Tạo mới'}
                </>
              )}
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormFeatureAdmin;

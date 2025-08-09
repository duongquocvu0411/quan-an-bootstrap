import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from '../DarkModeContext';
import { toast, ToastContainer } from 'react-toastify';
import { createChefsAdmin, getChefById, updateChefsAdmin } from '../../../be/Admin/Chefs/ChefsAdmin.api';

const FormChefsAdmin = ({ mode }) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    displayOrder: 1,
    imageUrl: '', // Lưu url hoặc base64 preview
    imageFile: null, // Lưu file ảnh để gửi lên server (nếu có)
    twitterLink: '',
    facebookLink: '',
    instagramLink: '',
    linkedinLink: '',
    isActive: true,
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: '',
  });

useEffect(() => {
  if ((mode === 'edit' || mode === 'detail') && id) {
    getChefById(id)
      .then(res => {
        if (res.isSuccess && res.data) {
          const roles = ['Admin', 'Manager', 'Chef', 'Receptionist', 'Guest', 'HR'];
          const normalizedRole = roles.find(r => r.toLowerCase() === (res.data.role || '').toLowerCase()) || '';

          setForm(prevForm => ({
            ...prevForm,
            ...res.data,
            role: normalizedRole,
            imageFile: null,
          }));
        } else {
          toast.error(res.message || 'Không tìm thấy chef!');
          navigate('/admin/chefs');
        }
      })
      .catch(() => {
        toast.error('Lỗi khi tải dữ liệu!');
        navigate('/admin/chefs');
      });
  }
}, [mode, id, navigate]);


  const handleChange = (e) => {
    if (mode === 'detail') return;

    const { name, value, type, checked, files } = e.target;

    if (name === 'imageFile' && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setForm(prev => ({
        ...prev,
        imageFile: file,
        imageUrl,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Name', form.name);
      formData.append('Role', form.role);
      formData.append('DisplayOrder', Number(form.displayOrder));
      formData.append('IsActive', form.isActive);
      formData.append('TwitterLink', form.twitterLink || '');
      formData.append('FacebookLink', form.facebookLink || '');
      formData.append('InstagramLink', form.instagramLink || '');
      formData.append('LinkedinLink', form.linkedinLink || '');

      if (form.imageFile) {
        formData.append('ImageFile', form.imageFile);
      }

      if (mode === 'edit') {
        formData.append('Id', id);
      }

      let res;
      if (mode === 'add') {
        res = await createChefsAdmin(formData);
      } else if (mode === 'edit') {
        res = await updateChefsAdmin(formData);
      }

      if (res.isSuccess) {
        toast.success(res.message || `${mode === 'add' ? 'Thêm mới' : 'Cập nhật'} chef thành công!`);
        setTimeout(() => navigate('/admin/chefs'), 1000);
      } else {
        toast.error(res.message || 'Có lỗi xảy ra, vui lòng thử lại!');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Lỗi khi gửi dữ liệu lên server!');
      }
      console.error(error);
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
              <a href="/admin/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/admin/chefs">
                <i className="bi bi-people-fill me-1"></i>Chefs
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {mode === 'detail'
                ? <><i className="bi bi-person-lines-fill me-1"></i>Chi tiết chef</>
                : mode === 'edit'
                ? <><i className="bi bi-pencil-square me-1"></i>Chỉnh sửa chef</>
                : <><i className="bi bi-plus-circle me-1"></i>Thêm mới chef</>}
            </li>
          </ol>
        </nav>

        <h4 className="fw-bold mb-3">
          {mode === 'detail'
            ? <><i className="bi bi-eye-fill me-2"></i>Xem chi tiết chef</>
            : mode === 'edit'
            ? <><i className="bi bi-pencil-fill me-2"></i>Chỉnh sửa chef</>
            : <><i className="bi bi-person-plus-fill me-2"></i>Thêm mới chef</>}
        </h4>

        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Quay lại
        </button>

        <form onSubmit={handleSubmit}>
          {/* Tên */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">
              <i className="bi bi-person-fill me-1"></i>Tên
            </label>
            <input
              name="name"
              className="form-control ps-4"
              value={form.name}
              onChange={handleChange}
              disabled={mode === 'detail'}
              required
              placeholder="Nhập tên chef..."
            />
          </div>

          {/* Vai trò */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">
              <i className="bi bi-briefcase-fill me-1"></i>Vai trò
            </label>
            <select
  name="role"
  className="form-select ps-4"
  value={form.role}
  onChange={handleChange}
  disabled={mode === 'detail'}
  required
>
  <option value="">-- Chọn vai trò --</option>
  <option value="Admin">Admin</option>
  <option value="Manager">Manager</option>
  <option value="Chef">Chef</option>
  <option value="Receptionist">Receptionist</option>
  <option value="Guest">Guest</option>
  <option value="HR">HR</option>
</select>

          </div>

          {/* Thứ tự hiển thị */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">
              <i className="bi bi-list-ol me-1"></i>Thứ tự hiển thị
            </label>
            <input
              type="number"
              name="displayOrder"
              className="form-control ps-4"
              value={form.displayOrder}
              onChange={handleChange}
              disabled={mode === 'detail'}
              min={1}
              required
              placeholder="Nhập thứ tự..."
            />
          </div>

          {/* Ảnh */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="bi bi-image-fill me-1"></i>Ảnh
            </label>
            {mode !== 'detail' && (
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
              />
            )}
            {(form.imageUrl || mode === 'detail') && (
              <div className="mt-2 text-center">
                <img
                  src={form.imageUrl}
                  alt={form.name}
                  className="img-thumbnail"
                  style={{ maxWidth: '100%', height: '400px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          {/* Các social links */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="bi bi-twitter me-1"></i>Twitter Link
            </label>
            <input
              name="twitterLink"
              className="form-control ps-4"
              value={form.twitterLink || ''}
              onChange={handleChange}
              disabled={mode === 'detail'}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="bi bi-facebook me-1"></i>Facebook Link
            </label>
            <input
              name="facebookLink"
              className="form-control ps-4"
              value={form.facebookLink || ''}
              onChange={handleChange}
              disabled={mode === 'detail'}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="bi bi-instagram me-1"></i>Instagram Link
            </label>
            <input
              name="instagramLink"
              className="form-control ps-4"
              value={form.instagramLink || ''}
              onChange={handleChange}
              disabled={mode === 'detail'}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="bi bi-linkedin me-1"></i>LinkedIn Link
            </label>
            <input
              name="linkedinLink"
              className="form-control ps-4"
              value={form.linkedinLink || ''}
              onChange={handleChange}
              disabled={mode === 'detail'}
              placeholder="https://linkedin.com/..."
            />
          </div>

          <div className="form-check form-switch mb-3">
            <input
              type="checkbox"
              name="isActive"
              className="form-check-input"
              checked={form.isActive}
              onChange={handleChange}
              disabled={mode === 'detail'}
              id="isActiveSwitch"
            />
            <label className="form-check-label" htmlFor="isActiveSwitch">
              <i className="bi bi-toggle-on me-1"></i>Đang hoạt động
            </label>
          </div>

          {mode === 'detail' && (
            <div className="mb-3">
              <p><i className="bi bi-calendar-check me-1"></i><strong>Ngày tạo:</strong> {form.createdAt ? new Date(form.createdAt).toLocaleString() : ''}</p>
              <p><i className="bi bi-person-check me-1"></i><strong>Người tạo:</strong> {form.createdBy}</p>
              <p><i className="bi bi-calendar-event me-1"></i><strong>Ngày cập nhật:</strong> {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : ''}</p>
              <p><i className="bi bi-person-lines-fill me-1"></i><strong>Người cập nhật:</strong> {form.updatedBy}</p>
            </div>
          )}

          {mode !== 'detail' && (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <i className={mode === 'edit' ? "bi bi-pencil-square me-2" : "bi bi-plus-circle me-2"}></i>
              {loading ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang tạo...') : (mode === 'edit' ? 'Cập nhật' : 'Tạo mới')}
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormChefsAdmin;

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DarkModeContext } from '../DarkModeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './../Page/Sidebar';
import { createContactAdmin, getContactAdminById, updateContactAdmin } from '../../../be/Admin/Contact/AdminContact.api';

const FormContactAdmin = ({ mode }) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    location: '',
    phoneNumber: '',
    emailAddress: '',
    openHours: '',
    mapurl: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchDetail = async () => {
      if (mode !== 'add') {
        try {
          const data = await getContactAdminById(id);
          setForm(data);
        } catch (error) {
          toast.error('Không thể tải dữ liệu liên hệ');
        }
      }
    };

    fetchDetail();
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('Location', form.location);
    formData.append('PhoneNumber', form.phoneNumber);
    formData.append('EmailAddress', form.emailAddress);
    formData.append('OpenHours', form.openHours);
    formData.append('Mapurl', form.mapurl);
    formData.append('IsActive', form.isActive);

    try {
      let res;
      if (mode === 'add') {
        res = await createContactAdmin(formData);
      } else if (mode === 'edit') {
        res = await updateContactAdmin(id, formData);
      }

      if (res?.isSuccess) {
        toast.success(`${mode === 'edit' ? 'Cập nhật' : 'Thêm mới'} thành công!`);
        setTimeout(() => navigate('/admin/contact-admin'), 1500);
      } else {
        toast.error(res?.message || 'Thao tác thất bại!');
      }
    } catch (err) {
      toast.error(err?.message || 'Lỗi không xác định!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item"><a href="/admin/contact-admin">Thông tin liên hệ cửa hàng</a></li>
            <li className="breadcrumb-item active" aria-current="page">
              {mode === 'detail' ? 'Chi tiết' : mode === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}
            </li>
          </ol>
        </nav>

        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-circle me-1"></i> Quay lại
        </button>

        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-geo-alt-fill me-2 fs-5"></i>
            <h5 className="mb-0">
              {mode === 'detail' ? 'Chi tiết' : mode === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'} thông tin liên hệ
            </h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>Địa chỉ
                </label>
                <input
                  name="location"
                  className="form-control"
                  value={form.location}
                  onChange={handleChange}
                  disabled={mode === 'detail'}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-telephone-fill text-success me-2"></i>Số điện thoại
                </label>
                <input
                  name="phoneNumber"
                  className="form-control"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  disabled={mode === 'detail'}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-envelope-fill text-primary me-2"></i>Email
                </label>
                <input
                  name="emailAddress"
                  className="form-control"
                  value={form.emailAddress}
                  onChange={handleChange}
                  disabled={mode === 'detail'}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-clock-fill text-warning me-2"></i>Giờ mở cửa
                </label>
                <input
                  name="openHours"
                  className="form-control"
                  value={form.openHours}
                  onChange={handleChange}
                  disabled={mode === 'detail'}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-map text-info me-2"></i>Google Map (iframe)
                </label>
                {mode === 'detail' ? (
                  <div className="rounded overflow-hidden border" dangerouslySetInnerHTML={{ __html: form.mapurl }} />
                ) : (
                  <textarea
                    name="mapurl"
                    className="form-control"
                    rows={4}
                    value={form.mapurl}
                    onChange={handleChange}
                    disabled={mode === 'detail'}
                  />
                )}
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  disabled={mode === 'detail'}
                />
                <label className="form-check-label fw-bold">
                  <i className="bi bi-toggle-on me-1"></i>Trạng thái hoạt động
                </label>
              </div>

              {mode !== 'detail' && (
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-1"></i> Lưu
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormContactAdmin;

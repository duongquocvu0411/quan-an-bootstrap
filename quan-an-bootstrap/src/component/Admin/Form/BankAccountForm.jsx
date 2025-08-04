import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from '../DarkModeContext';
import { toast, ToastContainer } from 'react-toastify';
import { createPaymentQrAccount, getPaymentQrById, updatePaymentQrAccount } from '../../../be/Admin/Payment/payment.api';

const BankAccountForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankBin: '',
    accountNumber: '',
    accountName: '',
    isActive: true,
    notePrefix: '',
    enableAmountLock: false
  });

  const isDetail = mode === 'detail';
  const isEdit = mode === 'edit';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPaymentQrById(id);
        setFormData(data);
      } catch (err) {
        toast.error("Không thể tải dữ liệu tài khoản");
      } finally {
        setLoading(false);
      }
    };

    if ((isDetail || isEdit) && id) {
      fetchData();
    }
  }, [id, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.bankBin || !formData.accountNumber || !formData.accountName) {
    toast.warning('Vui lòng nhập đầy đủ thông tin bắt buộc.');
    return;
  }

  try {
    let res;
    if (mode === 'add') {
      res = await createPaymentQrAccount(formData);
    } else if (mode === 'edit' && id) {
      res = await updatePaymentQrAccount(id, formData);
    }

    if (res?.isSuccess) {
      toast.success(res.message || 'Thành công');
      navigate('/admin/bank-accounts');
    } else {
      toast.error(res?.message || 'Thất bại');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi dữ liệu');
  }
};

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/bank-accounts')}>
          ← Quay lại
        </button>

        <div className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>
          <div className="card-body">
            <h4 className={`mb-3 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
              {mode === 'add' && 'Thêm tài khoản ngân hàng'}
              {mode === 'edit' && 'Chỉnh sửa tài khoản ngân hàng'}
              {mode === 'detail' && 'Chi tiết tài khoản ngân hàng'}
            </h4>

            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : (
              <form onSubmit={handleSubmit} className="row">
                <div className="mb-3 col-6">
                  <label className="form-label">BIN ngân hàng</label>
                  <input
                    type="text"
                    name="bankBin"
                    className="form-control"
                    value={formData.bankBin}
                    onChange={handleChange}
                    disabled={isDetail}
                    required
                  />
                </div>
                <div className="mb-3 col-6">
                  <label className="form-label">Số tài khoản</label>
                  <input
                    type="text"
                    name="accountNumber"
                    className="form-control"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    disabled={isDetail}
                    required
                  />
                </div>
                <div className="mb-3 col-6">
                  <label className="form-label">Tên tài khoản</label>
                  <input
                    type="text"
                    name="accountName"
                    className="form-control"
                    value={formData.accountName}
                    onChange={handleChange}
                    disabled={isDetail}
                    required
                  />
                </div>
                <div className="mb-3 col-6">
                  <label className="form-label">Tiền tố ghi chú</label>
                  <input
                    type="text"
                    name="notePrefix"
                    className="form-control"
                    value={formData.notePrefix}
                    onChange={handleChange}
                    disabled={isDetail}
                  />
                </div>
                <div className="mb-3 col-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="activeCheck"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      disabled={isDetail}
                    />
                    <label className="form-check-label" htmlFor="activeCheck">Kích hoạt</label>
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="lockAmount"
                      name="enableAmountLock"
                      checked={formData.enableAmountLock}
                      onChange={handleChange}
                      disabled={isDetail}
                    />
                    <label className="form-check-label" htmlFor="lockAmount">Khóa số tiền</label>
                  </div>
                </div>
                {!isDetail && (
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      {mode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BankAccountForm;

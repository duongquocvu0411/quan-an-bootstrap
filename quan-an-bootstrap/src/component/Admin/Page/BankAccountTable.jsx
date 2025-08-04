// BankAccountTable.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from '../DarkModeContext';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import { deletePaymentQrAccounts, getAllPaymentQrAccounts } from '../../../be/Admin/Payment/payment.api';

const BankAccountTable = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showInactive, setShowInactive] = useState(false); // Lọc trạng thái

  const pageSize = 10;

  const fetchAccounts = async (page = 1) => {
    try {
      const isActive = !showInactive;
      const data = await getAllPaymentQrAccounts(page, pageSize, isActive);
      setAccounts(data.results || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách tài khoản ngân hàng QR');
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage + 1);
  }, [currentPage, showInactive]);

  const filtered = accounts.filter(item =>
    item.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentIds = filtered.map(i => i.id);
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    setSelectedIds(
      allSelected
        ? selectedIds.filter(id => !currentIds.includes(id))
        : [...selectedIds, ...currentIds.filter(id => !selectedIds.includes(id))]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tài khoản này?')) {
      try {
        const res = await deletePaymentQrAccounts([id]);
        if (res?.isSuccess) {
          toast.success(res.message || 'Đã xoá thành công');
          fetchAccounts(currentPage + 1);
          setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
          toast.error(res.message || 'Xoá thất bại');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Lỗi khi xoá');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Xác nhận xoá ${selectedIds.length} tài khoản?`)) {
      try {
        const res = await deletePaymentQrAccounts(selectedIds);
        if (res?.isSuccess) {
          toast.success(res.message || 'Đã xoá thành công');
          fetchAccounts(currentPage + 1);
          setSelectedIds([]);
        } else {
          toast.error(res.message || 'Xoá thất bại');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Lỗi khi xoá');
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={() => navigate('/admin/bank-accounts/add')}>
            <i className="bi bi-plus-circle me-2"></i>Thêm tài khoản
          </button>

          <div className="d-flex align-items-center gap-3 w-75">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm tên tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="inactiveSwitch"
                checked={showInactive}
                onChange={() => {
                  setCurrentPage(0);
                  setShowInactive(!showInactive);
                }}
              />
              <label className="form-check-label ms-2" htmlFor="inactiveSwitch">
                {showInactive ? 'Xem không hoạt động' : 'Xem hoạt động'}
              </label>
            </div>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <span>Đã chọn {selectedIds.length} tài khoản</span>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected}>
              <i className="bi bi-trash me-1"></i>Xoá đã chọn
            </button>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <h5 className={`mb-3 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
              <i className="bi bi-bank me-2"></i>
              {showInactive ? 'Danh sách tài khoản không hoạt động' : 'Danh sách tài khoản đang hoạt động'}
            </h5>

            <table className="table table-bordered">
              <thead className={darkMode ? 'table-dark' : 'table-light'}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filtered.length > 0 && filtered.every(i => selectedIds.includes(i.id))}
                    />
                  </th>
                  <th>#</th>
                  <th>Tên tài khoản</th>
                  <th>Số tài khoản</th>
                  <th>Ngân hàng</th>
                  <th>BIN</th>
                  <th>Ghi chú</th>
                  <th>Khoá tiền</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="10" className="text-center">Không có dữ liệu</td></tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelect(item.id)}
                        />
                      </td>
                      <td>{(currentPage * pageSize) + index + 1}</td>
                      <td>{item.accountName}</td>
                      <td>{item.accountNumber}</td>
                      <td>{item.bankShortName || '—'}</td>
                      <td>{item.bankBin}</td>
                      <td>{item.notePrefix}</td>
                      <td>{item.enableAmountLock ? 'Có' : 'Không'}</td>
                      <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                      <td>
                        <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/admin/bank-accounts/detail/${item.id}`)}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/admin/bank-accounts/edit/${item.id}`)}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <ReactPaginate
              pageCount={totalPages}
              onPageChange={({ selected }) => setCurrentPage(selected)}
              containerClassName={'pagination justify-content-center'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousLabel={'←'}
              nextLabel={'→'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BankAccountTable;

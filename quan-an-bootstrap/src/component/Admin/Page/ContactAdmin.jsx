import React, { useState, useContext, useEffect } from 'react';
import { DarkModeContext } from '../DarkModeContext';
import Sidebar from './Sidebar';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteContactAdmin, getAllContactAdmins } from '../../../be/Admin/Contact/AdminContact.api';

const ContactAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [showActive, setShowActive] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async () => {
    try {
      const data = await getAllContactAdmins(currentPage + 1, pageSize, showActive);
      setContacts(data.results || []);
      setTotalPages(data.totalPages || 0);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu liên hệ admin!');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, showActive]);

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const toggleSelectAll = () => {
    if (selectedIds.length === contacts.length) setSelectedIds([]);
    else setSelectedIds(contacts.map(c => c.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
  if (window.confirm(`Xoá bản ghi ID ${id}?`)) {
    try {
      const res = await deleteContactAdmin([id]);

      if (res?.isSuccess) {
        const deletedIds = res.data?.deletedIds || [];
        const skippedIds = res.data?.skippedIds || [];

        if (deletedIds.includes(id)) {
          toast.success(res.message || `Đã xoá ID ${id}`);
          setContacts(prev => prev.filter(c => c.id !== id));
          setSelectedIds(prev => prev.filter(i => i !== id));
        } else if (skippedIds.includes(id)) {
          toast.warning(res.message || `Không thể xoá ID ${id} (IsActive = true)`);
        } else {
          toast.info(res.message || `Không có bản ghi nào bị xoá`);
        }
      } else {
        toast.error(res.message || `Xóa thất bại ID ${id}`);
      }
    } catch (err) {
      toast.error(err.message || `Lỗi không xác định khi xoá ID ${id}`);
    }
  }
};


const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;

  if (window.confirm(`Xác nhận xoá ${selectedIds.length} bản ghi?`)) {
    try {
      const res = await deleteContactAdmin(selectedIds);

      if (res?.isSuccess) {
        const deletedIds = res.data?.deletedIds || [];
        const skippedIds = res.data?.skippedIds || [];

        // Cập nhật danh sách contact
        setContacts(prev => prev.filter(c => !deletedIds.includes(c.id)));
        setSelectedIds([]);

        toast.success(res.message || `Đã xóa ${deletedIds.length} bản ghi`);
      } else {
        toast.error(res.message || 'Xóa thất bại');
      }
    } catch (err) {
      toast.error(err.message || 'Lỗi không xác định khi xóa.');
    }
  }
};


  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Thông tin liên hệ cửa hàng</li>
          </ol>
        </nav>

        {/* Tiêu đề + mô tả */}
        <div className="mb-4">
          <h3 className="fw-bold text-primary d-flex align-items-center">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Quản lý Thông tin liên hệ Cửa hàng
          </h3>
          <p className="text-muted mb-0">
            Đây là nơi bạn quản lý địa chỉ, số điện thoại, email và bản đồ Google Map để hiển thị ngoài trang khách hàng.
          </p>
        </div>

        {/* Bộ lọc + thêm mới + xoá nhiều */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="activeSwitch"
              checked={showActive}
              onChange={() => {
                setCurrentPage(0);
                setShowActive(!showActive);
              }}
            />
            <label className="form-check-label ms-2" htmlFor="activeSwitch">
              {showActive ? 'Đang lọc: Đang hoạt động' : 'Đang lọc: Không hoạt động'}
            </label>
          </div>
          <div className="d-flex gap-2">
            {selectedIds.length > 0 && (
              <button className="btn btn-danger" onClick={handleDeleteSelected}>
                <i className="bi bi-trash"></i> Xoá đã chọn ({selectedIds.length})
              </button>
            )}
            <button className="btn btn-success" onClick={() => navigate('/admin/contact-admin/add')}>
              <i className="bi bi-plus-circle me-1"></i> Thêm mới
            </button>
          </div>
        </div>

        {/* Bảng danh sách */}
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th><input type="checkbox" checked={selectedIds.length === contacts.length} onChange={toggleSelectAll} /></th>
              <th>#</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Giờ mở cửa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
            ) : (
              contacts.map((c, idx) => (
                <tr key={c.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelectOne(c.id)}
                    />
                  </td>
                  <td>{idx + 1 + currentPage * pageSize}</td>
                  <td>{c.location}</td>
                  <td>{c.phoneNumber}</td>
                  <td>{c.emailAddress}</td>
                  <td>{c.openHours}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-info btn-sm" onClick={() => navigate(`/admin/contact-admin/detail/${c.id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-warning btn-sm" onClick={() => navigate(`/admin/contact-admin/edit/${c.id}`)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        <ReactPaginate
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageChange}
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
      <ToastContainer />
    </div>
  );
};

export default ContactAdmin;

import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../DarkModeContext';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import { deleteManyContactUsers, getAllContactUsers } from '../../../be/Admin/Contact/ContactUserAdmin.api';

const ContactUser = () => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based for ReactPaginate
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showReplied, setShowReplied] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getAllContactUsers(currentPage + 1, pageSize, showReplied);
      setContacts(data.results || []);
      setTotalPages(data.totalPages || 0);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu liên hệ!');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, showReplied]);

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const toggleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(c => c.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

 const handleDeleteOne = async (id) => {
  if (!window.confirm(`Bạn có chắc chắn muốn xoá liên hệ ID ${id}?`)) return;

  try {
    const response = await deleteManyContactUsers([id]); // gửi mảng 1 phần tử
    toast.success(response.message || `Đã xoá liên hệ ID ${id}`);
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  } catch (error) {
    toast.error('Xoá liên hệ thất bại!');
  }
};


const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;
  if (!window.confirm(`Xác nhận xoá ${selectedIds.length} liên hệ?`)) return;

  try {
    const response = await deleteManyContactUsers(selectedIds);
    toast.success(response.message || 'Xoá các liên hệ thành công');
    setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
  } catch (error) {
    toast.error('Xoá nhiều liên hệ thất bại!');
  }
};


  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active">Liên hệ người dùng</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check form-switch d-flex align-items-center">
            <input
              className="form-check-input"
              type="checkbox"
              id="repliedSwitch"
              checked={showReplied}
              onChange={() => {
                setCurrentPage(0); // reset page
                setShowReplied(!showReplied);
              }}
            />
            <label className="form-check-label ms-2" htmlFor="repliedSwitch">
              {showReplied ? 'Đang lọc: Đã phản hồi' : 'Đang lọc: Chưa phản hồi'}
            </label>
          </div>

          {selectedIds.length > 0 && (
            <button className="btn btn-danger" onClick={handleDeleteSelected}>
              <i className="bi bi-trash"></i> Xoá đã chọn ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === contacts.length && contacts.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Tiêu đề</th>
                  <th>Ngày gửi</th>
                  <th>Phản hồi</th>
                  <th>Người phản hồi</th>
                  <th>Thời gian</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr><td colSpan="10" className="text-center">Không có dữ liệu</td></tr>
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
                      <td>{c.yourName}</td>
                      <td>{c.email}</td>
                      <td>{c.subject}</td>
                      <td>{new Date(c.createdAt).toLocaleString('vi-VN')}</td>
                      <td>{c.isReplied ? 'Đã phản hồi' : 'Chưa'}</td>
                      <td>{c.repliedBy || '—'}</td>
                      <td>{c.repliedAt ? new Date(c.repliedAt).toLocaleString('vi-VN') : '—'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => navigate(`/admin/contact-users/detail/${c.id}`)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {!c.isReplied && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => navigate(`/admin/contact-users/reply/${c.id}`)}
                            >
                              <i className="bi bi-reply-fill"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteOne(c.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactUser;

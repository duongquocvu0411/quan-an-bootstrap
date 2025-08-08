import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import { DarkModeContext } from './../DarkModeContext';
import { deleteAboutItems, getAdminAboutList } from '../../../be/Admin/About/AboutAdmin.api';

const AboutAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [showActive, setShowActive] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [abouts, setAbouts] = useState([]);



 const fetchData = async () => {
  try {
    const res = await getAdminAboutList(currentPage + 1, pageSize, showActive);
    if (res.isSuccess) {
      setAbouts(res.data.results);
    } else {
      toast.error(res.message || 'Lỗi tải danh sách');
      setAbouts([]);
    }
    setSelectedIds([]);
  } catch (error) {
    toast.error('Lỗi kết nối server');
    setAbouts([]);
  }
};

useEffect(() => {
  fetchData();
}, [showActive, currentPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === abouts.length) setSelectedIds([]);
    else setSelectedIds(abouts.map(a => a.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(`Bạn có chắc muốn xoá About ID ${id}?`);
  if (!confirmDelete) return;

  const res = await deleteAboutItems([id]);

  if (res.isSuccess) {
    toast.success(res.message || `Đã xoá ID ${id}`);
    setAbouts(prev => prev.filter(a => a.id !== id));
  } else {
    toast.error(res.message || 'Xóa thất bại!');
  }
};



const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;

  const confirm = window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} bản ghi?`);
  if (!confirm) return;

  const res = await deleteAboutItems(selectedIds);

  if (res.isSuccess) {
    toast.success(res.message || `Đã xóa ${selectedIds.length} bản ghi`);
    setAbouts(prev => prev.filter(a => !selectedIds.includes(a.id)));
    setSelectedIds([]);
  } else {
    toast.error(res.message || 'Xóa thất bại!');
  }
};



  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Giới thiệu</li>
          </ol>
        </nav>

        <div className="mb-4">
          <h3 className="fw-bold text-primary d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            Quản lý nội dung Giới thiệu
          </h3>
          <p className="text-muted mb-0">Quản lý các khối nội dung trong trang Giới thiệu.</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="activeSwitch"
              checked={showActive}
              onChange={() => setShowActive(!showActive)}
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
            <button className="btn btn-success" onClick={() => navigate('/admin/about/add')}>
              <i className="bi bi-plus-circle me-1"></i> Thêm mới
            </button>
          </div>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th><input type="checkbox" checked={selectedIds.length === abouts.length} onChange={toggleSelectAll} /></th>
              <th>#</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Người tạo</th>
              <th>Ngày cập nhật</th>
              <th>Người cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {abouts.length === 0 ? (
              <tr><td colSpan="9" className="text-center">Không có dữ liệu</td></tr>
            ) : (
              abouts.map((a, idx) => (
                <tr key={a.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelectOne(a.id)} /></td>
                  <td>{idx + 1}</td>
                  <td>{a.descriptions}</td>
                  <td>{a.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>{a.createdBy}</td>
                  <td>{new Date(a.updatedAt).toLocaleDateString()}</td>
                  <td>{a.updatedBy}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-info btn-sm" onClick={() => navigate(`/admin/about/detail/${a.id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-warning btn-sm" onClick={() => navigate(`/admin/about/edit/${a.id}`)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>
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
          pageCount={1}
          forcePage={currentPage}
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
      <ToastContainer />
    </div>
  );
};

export default AboutAdmin;
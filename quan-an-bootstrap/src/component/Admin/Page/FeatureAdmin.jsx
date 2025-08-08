import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from '../DarkModeContext';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { deleteFeatureAdmin, getAllFeatureAdmins } from '../../../be/Admin/Feature/FeatureAdmin.api';


const FeatureAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [features, setFeatures] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showActive, setShowActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await getAllFeatureAdmins(currentPage + 1, pageSize, showActive);
      setFeatures(res.results || []);
      setTotalPages(res.totalPages || 0);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tính năng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [currentPage, showActive]);

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === features.length ? [] : features.map(f => f.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

 const handleDelete = async (id) => {
  if (!window.confirm('Bạn có chắc muốn xoá bản ghi này?')) return;

  try {
    const response = await deleteFeatureAdmin([id]);

    if (response?.isSuccess) {
      toast.success(response.message || 'Xoá thành công');
      await fetchFeatures(); // cập nhật danh sách sau xoá
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      toast.error(response.message || 'Xoá thất bại');
    }
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi xoá');
  }
};


const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;

  if (!window.confirm(`Bạn có chắc muốn xoá ${selectedIds.length} bản ghi?`)) return;

  try {
    const response = await deleteFeatureAdmin(selectedIds);

    if (response?.isSuccess) {
      toast.success(response.message || 'Xoá thành công');
      await fetchFeatures(); // cập nhật danh sách sau khi xoá
      setSelectedIds([]);
    } else {
      toast.error(response.message || 'Xoá thất bại');
    }
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi xoá');
  }
};


  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb" className="mb-3">
  <ol className="breadcrumb">
    <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
    <li className="breadcrumb-item active" aria-current="page">Danh sách tính năng</li>
  </ol>
</nav>

        <h3 className="fw-bold text-primary">Quản lý Why Us / Features</h3>

        {/* Bộ lọc và nút thao tác */}
        <div className="d-flex justify-content-between my-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="switchActive"
              checked={showActive}
              onChange={() => {
                setCurrentPage(0);
                setShowActive(!showActive);
              }}
            />
            <label className="form-check-label ms-2" htmlFor="switchActive">
              {showActive ? 'Đang lọc: Đang hoạt động' : 'Đang lọc: Không hoạt động'}
            </label>
          </div>
          <div>
            {selectedIds.length > 0 && (
              <button className="btn btn-danger me-2" onClick={handleDeleteSelected}>
                Xoá đã chọn ({selectedIds.length})
              </button>
            )}
            <button className="btn btn-success" onClick={() => navigate('/admin/features/add')}>
              Thêm mới
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th><input type="checkbox" checked={selectedIds.length === features.length} onChange={toggleSelectAll} /></th>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Ảnh</th>
                <th>Link</th>
                <th>Thứ tự</th>
                <th>Ngày tạo</th>
                <th>Người tạo</th>
                <th>Ngày cập nhật</th>
                <th>Người cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="text-center">Đang tải dữ liệu...</td></tr>
              ) : features.length === 0 ? (
                <tr><td colSpan="11" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                features.map((f, idx) => (
                  <tr key={f.id}>
                    <td className="text-center">
                      <input type="checkbox" checked={selectedIds.includes(f.id)} onChange={() => toggleSelectOne(f.id)} />
                    </td>
                    <td>{idx + 1 + currentPage * pageSize}</td>
                    <td>{f.title}</td>
                    <td><img src={f.image} alt="img" width={50} /></td>
                    <td><a href={f.link} target="_blank" rel="noopener noreferrer">{f.link}</a></td>
                    <td className="text-center">{f.displayOrder}</td>
                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                    <td>{f.createdBy}</td>
                    <td>{new Date(f.updatedAt).toLocaleString()}</td>
                    <td>{f.updatedBy}</td>
                   <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-1 flex-nowrap">
                        <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/admin/features/detail/${f.id}`)}
                        title="Xem chi tiết"
                        >
                        <i className="bi bi-eye"></i>
                        </button>
                        <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/admin/features/edit/${f.id}`)}
                        title="Chỉnh sửa"
                        >
                        <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(f.id)}
                        title="Xoá"
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
        </div>

        {/* Phân trang */}
        <ReactPaginate
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageChange}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousLabel="←"
          nextLabel="→"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default FeatureAdmin;

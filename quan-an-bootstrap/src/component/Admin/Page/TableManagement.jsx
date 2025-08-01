import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import { deleteTablePermanently, getAllTables, restoreTable, softDeleteTable } from '../../../be/Admin/Tables/Table.api';
import  Cookies  from 'js-cookie';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 20, totalPages: 0, totalCount: 0 });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchTableData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAllTables(page, pagination.pageSize, showDeleted);
      setTables(res.results || []);
      setPagination({
        currentPage: res.currentPage,
        pageSize: res.pageSize,
        totalPages: res.totalPages,
        totalCount: res.totalCount
      });
    } catch (err) {
      toast.error("Lỗi khi tải danh sách bàn ăn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(1);
  }, [showDeleted]);

  const handleFilter = () => {
    fetchTableData(1);
  };

  const handlePageChange = ({ selected }) => {
    fetchTableData(selected + 1);
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bàn này?')) return;

    try {
      const res = await softDeleteTable(id);
      if (res.isSuccess && res.code === 200) {
        toast.success(res.message || 'Đã xoá mềm bàn thành công!');
        fetchTableData(pagination.currentPage);
      } else {
        toast.error(res.message || 'Xoá mềm không thành công!');
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi xoá bàn!');
    }
  };

  const handleRestore = async (id) => {
  if (!window.confirm('Bạn có muốn khôi phục bàn này không?')) return;

  try {
    const res = await restoreTable(id);
    if (res.isSuccess && res.code === 200) {
      toast.success(res.message || 'Khôi phục thành công!');
      fetchTableData(pagination.currentPage);
    } else {
      toast.error(res.message || 'Khôi phục không thành công!');
    }
  } catch (err) {
    toast.error('Lỗi khi gọi API khôi phục!');
  }
};


 const handleDeleteForever = async (id) => {
  if (!window.confirm('Bạn có chắc muốn xoá vĩnh viễn bàn này? Hành động không thể hoàn tác.')) return;

  try {
    const res = await deleteTablePermanently(id);
    if (res.isSuccess && res.code === 200) {
      toast.success(res.message || 'Đã xoá vĩnh viễn bàn!');
      fetchTableData(pagination.currentPage); // reload
    } else {
      toast.error(res.message || 'Xoá vĩnh viễn không thành công!');
    }
  } catch (err) {
    toast.error('Đã xảy ra lỗi khi xoá vĩnh viễn!');
  }
};
  const filteredTables = tables.filter(t =>
    t.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statusRaw) => {
    const status = String(statusRaw || '').toLowerCase();

    // map màu 
    const map = {
      available: { className: 'bg-success', label: 'Available' },
      reserved:  { className: 'bg-warning text-dark', label: 'Reserved' },
      occupied:  { className: 'bg-danger', label: 'Occupied' },
    };

    const picked = map[status] || {className: 'bg-secondary', label: statusRaw || 'Unknown'}

    return(
      <span className={`badge rounded-pill ${picked.className}`}>
      {picked.label}
    </span>
    )

  }

  const role = Cookies.get('roles')

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Quản lý bàn ăn</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={() => navigate('/admin/tables/add')}>
            <i className="bi bi-plus-circle me-2"></i>Thêm bàn ăn
          </button>

          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control me-2"
              style={{ width: '250px' }}
              placeholder="Tìm bàn theo số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="form-check form-switch me-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="deletedSwitch"
                checked={showDeleted}
                onChange={() => setShowDeleted(!showDeleted)}
              />
              <label className="form-check-label ms-1" htmlFor="deletedSwitch">
                Hiển thị bàn đã xoá
              </label>
            </div>

            <button className="btn btn-outline-secondary" onClick={handleFilter}>
              Lọc
            </button>
          </div>
        </div>

        {showDeleted && (
          <div className="alert alert-warning d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            Đang hiển thị danh sách bàn đã xoá – bạn có thể khôi phục hoặc xoá vĩnh viễn.
          </div>
        )}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
           <h5 className="card-title mb-3">
              <i className="bi bi-grid-1x2-fill me-2"></i>
              {showDeleted ? 'Danh sách bàn ăn đã bị ẩn (xoá mềm)' : 'Danh sách bàn ăn đang hoạt động'}
            </h5>


            {loading ? (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Số bàn</th>
                    <th>Sức chứa</th>
                    <th>Khu vực</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTables.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
                  ) : (
                    filteredTables.map((t, index) => (
                      <tr key={t.id}>
                        <td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</td>
                        <td>{t.tableNumber}</td>
                        <td>{t.capacity} người</td>
                        <td>{t.location}</td>
                        <td>{getStatusBadge(t.status  )}</td>
                        <td>{moment(t.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                        <td>
                          {showDeleted ? (
                            <>
                             <button
                                className="btn btn-info btn-sm me-2"
                                onClick={() => navigate(`/admin/tables/detail/${t.id}`)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleRestore(t.id)}
                              >
                                <i className="bi bi-arrow-counterclockwise"></i> Khôi phục
                              </button>
                              {role == 'Admin' &&(
                                <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteForever(t.id)}
                              >
                                <i className="bi bi-trash3"></i> Xoá vĩnh viễn
                              </button>
                              )}
                             
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-info btn-sm me-2"
                                onClick={() => navigate(`/admin/tables/detail/${t.id}`)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => navigate(`/admin/tables/edit/${t.id}`)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleSoftDelete(t.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {pagination.totalPages > 1 && (
              <ReactPaginate
                pageCount={pagination.totalPages}
                onPageChange={handlePageChange}
                forcePage={pagination.currentPage - 1}
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
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TableManagement;

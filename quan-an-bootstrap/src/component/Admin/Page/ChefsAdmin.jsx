import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from '../DarkModeContext';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { deleteChefsAdmin, getChefs } from '../../../be/Admin/Chefs/ChefsAdmin.api';


const ChefsAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [chefs, setChefs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showActive, setShowActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Hàm fetch dữ liệu từ backend
  const fetchData = async (pageNumber, isActive) => {
    setLoading(true);
    const res = await getChefs(pageNumber + 1, pageSize, isActive); // API dùng pageNumber từ 1
    setLoading(false);

    if (res.isSuccess && res.data) {
      setChefs(res.data.results);
      setTotalPages(res.data.totalPages);
      setSelectedIds([]);
    } else {
      toast.error(res.message || "Lỗi lấy dữ liệu chefs");
    }
  };

  // gọi fetchData khi component mount hoặc thay đổi filter/page
  useEffect(() => {
    fetchData(currentPage, showActive);
  }, [currentPage, showActive]);

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === chefs.length && chefs.length > 0
        ? []
        : chefs.map((c) => c.id)
    );
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xoá bản ghi này?")) return;

  try {
    const res = await deleteChefsAdmin([id]); // Gửi mảng chứa id để xóa
    if (res.isSuccess) {
      setChefs((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast.success(res.message || "Xoá thành công");
    } else {
      toast.error(res.message || "Xoá thất bại");
    }
  } catch (error) {
    toast.error("Lỗi khi xoá dữ liệu!");
    console.error(error);
  }
};


 const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;
  if (!window.confirm(`Bạn có chắc muốn xoá ${selectedIds.length} bản ghi?`)) return;

  try {
    const res = await deleteChefsAdmin(selectedIds);
    if (res.isSuccess) {
      setChefs((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      toast.success(res.message || `Xoá thành công ${selectedIds.length} bản ghi`);
    } else {
      toast.error(res.message || "Xoá thất bại");
    }
  } catch (error) {
    toast.error("Lỗi khi xoá dữ liệu!");
    console.error(error);
  }
};


  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <div className={`d-flex ${darkMode ? "bg-dark text-light" : ""}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: "250px" }}>
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/admin/dashboard">Dashboard</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Danh sách Chefs
            </li>
          </ol>
        </nav>

        <h3 className="fw-bold text-primary">Quản lý Chefs</h3>

        <div className="d-flex justify-content-between my-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="switchActive"
              checked={showActive}
              onChange={() => {
                setShowActive(!showActive);
                setSelectedIds([]);
                setCurrentPage(0);
              }}
            />
            <label className="form-check-label ms-2" htmlFor="switchActive">
              {showActive ? "Đang lọc: Đang hoạt động" : "Đang lọc: Không hoạt động"}
            </label>
          </div>
          <div>
            {selectedIds.length > 0 && (
              <button className="btn btn-danger me-2" onClick={handleDeleteSelected}>
                Xoá đã chọn ({selectedIds.length})
              </button>
            )}
            <button
              className="btn btn-success"
              onClick={() => navigate("/admin/chefs/add")}
            >
              Thêm mới
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === chefs.length && chefs.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>Ảnh</th>
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
                <tr>
                  <td colSpan="11" className="text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : chefs.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                chefs.map((chef, idx) => (
                  <tr key={chef.id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(chef.id)}
                        onChange={() => toggleSelectOne(chef.id)}
                      />
                    </td>
                    <td>{idx + 1 + currentPage * pageSize}</td>
                    <td>{chef.name}</td>
                    <td>{chef.role}</td>
                    <td className="text-center">
                      <img
                        src={chef.imageUrl}
                        alt={chef.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    </td>
                    <td className="text-center">{chef.displayOrder}</td>
                    <td>{new Date(chef.createdAt).toLocaleString()}</td>
                    <td>{chef.createdBy}</td>
                    <td>{new Date(chef.updatedAt).toLocaleString()}</td>
                    <td>{chef.updatedBy}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-1 flex-nowrap">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => navigate(`/admin/chefs/detail/${chef.id}`)}
                          title="Xem chi tiết"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => navigate(`/admin/chefs/edit/${chef.id}`)}
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(chef.id)}
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
          disabledClassName="disabled"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChefsAdmin;

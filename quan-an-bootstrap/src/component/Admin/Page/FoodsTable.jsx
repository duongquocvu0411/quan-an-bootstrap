import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { DarkModeContext } from './../DarkModeContext';
import Sidebar from './Sidebar';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/FoodCategoryPagination.css';
import { getAllFoods, deleteFoods } from '../../../be/Admin/Foods/Foods.api';

const FoodsTable = () => {
  // const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFood, setSelectedFood] = useState([]);
  const itemsPerPage = 10;

  const fetchFoods = async () => {
    try {
      const data = await getAllFoods(currentPage + 1, itemsPerPage);
      setFoods(data.foods);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Không thể tải danh sách món ăn');
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [currentPage]);

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá món ăn này?')) {
      try {
        const result = await deleteFoods([id]);
        if (result.isSuccess) {
          toast.success(result.message);
          setFoods(prev => prev.filter(f => f.id !== id));
          setSelectedFood(prev => prev.filter(fid => fid !== id));
        } else {
          toast.error(result.message || 'Xoá không thành công');
        }
      } catch (error) {
        toast.error('Lỗi khi xoá món ăn');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá các món đã chọn?')) {
      try {
        const result = await deleteFoods(selectedFood);
        if (result.isSuccess) {
          toast.success(result.message);
          setFoods(prev => prev.filter(f => !selectedFood.includes(f.id)));
          setSelectedFood([]);
        } else {
          toast.error(result.message || 'Xoá không thành công');
        }
      } catch (error) {
        toast.error('Lỗi khi xoá các món ăn đã chọn');
      }
    }
  };

  const handleSelectFood = (id) => {
    setSelectedFood((prev) =>
      prev.includes(id)
        ? prev.filter((foodId) => foodId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = foods.map((item) => item.id);
    const allSelected = currentPageIds.every((id) => selectedFood.includes(id));
    setSelectedFood((prev) =>
      allSelected
        ? prev.filter((id) => !currentPageIds.includes(id))
        : [...prev, ...currentPageIds.filter((id) => !prev.includes(id))]
    );
  };

  return (
    <div className={`d-flex `}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Món ăn</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={() => navigate('/admin/foods/add')}>
            <i className="bi bi-plus-circle me-2"></i>Thêm món ăn
          </button>
        </div>

        {selectedFood.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>Đã chọn {selectedFood.length} món ăn</span>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected}>
              Xoá các món đã chọn
            </button>
          </div>
        )}

        <div className={`card shadow-sm mb-4 `}>
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-tags-fill me-2"></i>Danh sách món ăn
            </h5>

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        foods.length > 0 &&
                        foods.every((item) => selectedFood.includes(item.id))
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th>Hình ảnh</th>
                  <th>Tên món</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Ngày tạo</th>
                  <th>Người tạo</th>
                  <th>Ngày cập nhật</th>
                  <th>Người cập nhật</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center">Không có dữ liệu</td>
                  </tr>
                ) : (
                  foods.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedFood.includes(item.id)}
                          onChange={() => handleSelectFood(item.id)}
                        />
                      </td>
                      <td>{currentPage * itemsPerPage + index + 1}</td>
                      <td>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.categoryName}</td>
                      <td>{item.price.toLocaleString()} đ</td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '—'}</td>
                      <td>{item.createdBy || '—'}</td>
                      <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : '—'}</td>
                      <td>{item.updatedBy || '—'}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => navigate(`/admin/foods/detail/${item.id}`)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/admin/foods/edit/${item.id}`)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
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

export default FoodsTable;

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from './../DarkModeContext';
import { toast, ToastContainer } from 'react-toastify';
import { addCategory, getCategoryDetail, updateCategory } from '../../../be/Admin/category/category.api';
import { deleteFoods } from '../../../be/Admin/Foods/Foods.api';

const FoodCategoryForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '', createdBy: '' });
  const [foods, setFoods] = useState([]);
  const [selectedFoodIds, setSelectedFoodIds] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);

  const isDetail = mode === 'detail';
  const isEdit = mode === 'edit';

  useEffect(() => {
    const fetchDetail = async () => {
      if (isEdit || isDetail) {
        const { category, foods, totalPages } = await getCategoryDetail(id, currentPage + 1);
        setCategory(category);
        setFoods(foods);
        setTotalPages(totalPages);
      }
    };
    fetchDetail();
  }, [id, mode, currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (mode === 'add') {
        res = await addCategory(category);
        if (res.code === 200) {
          toast.success(res.message);
          setCategory({ name: '' });
        } else {
          toast.error(res.message || 'Thêm danh mục thất bại');
        }
      } else if (mode === 'edit') {
        res = await updateCategory(id, { name: category.name });
        if (res.code === 200) {
          toast.success(res.message);
        } else {
          toast.error(res.message || 'Cập nhật danh mục thất bại');
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi xử lý. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (foodId) => {
    setSelectedFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const handleSelectAll = () => {
    const currentIds = foods.map((f) => f.id);
    const allSelected = currentIds.every((id) => selectedFoodIds.includes(id));
    setSelectedFoodIds(allSelected ? selectedFoodIds.filter(id => !currentIds.includes(id)) : [...selectedFoodIds, ...currentIds.filter(id => !selectedFoodIds.includes(id))]);
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá món ăn này?')) {
      try {
        await deleteFoods([id]);
        toast.success('Đã xoá món ăn');
        setFoods(prev => prev.filter(f => f.id !== id));
      } catch {
        toast.error('Xoá thất bại');
      }
    }
  };

  const handleDeleteMultiple = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá các món đã chọn?')) {
      try {
        await deleteFoods(selectedFoodIds);
        toast.success(`Đã xoá ${selectedFoodIds.length} món ăn`);
        setFoods(prev => prev.filter(f => !selectedFoodIds.includes(f.id)));
        setSelectedFoodIds([]);
      } catch {
        toast.error('Xoá thất bại');
      }
    }
  };

  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/food-categories')}>
          ← Quay lại
        </button>

        <div className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>
          <div className="card-body">
            <h4 className="mb-3">
              {mode === 'add' && 'Thêm danh mục món ăn'}
              {mode === 'edit' && 'Chỉnh sửa danh mục món ăn'}
              {mode === 'detail' && 'Chi tiết danh mục'}
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên danh mục</label>
                <input
                  type="text"
                  className="form-control"
                  value={category.name}
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  disabled={isDetail}
                  required
                />
              </div>
              {!isDetail && (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    mode === 'add' ? 'Thêm mới' : 'Cập nhật'
                  )}
                </button>
              )}
            </form>
          </div>
        </div>

        {isDetail && (
          <div className="card mt-4 ">
            <div className="card-body ">
              <h5 className='text-dark'>Danh sách món ăn trong danh mục</h5>

              {selectedFoodIds.length > 0 && (
                <div className="alert alert-info d-flex justify-content-between">
                  <span>Đã chọn {selectedFoodIds.length} món</span>
                  <button className="btn btn-danger btn-sm" onClick={handleDeleteMultiple}>Xoá đã chọn</button>
                </div>
              )}

              <table className="table table-bordered mt-3">
                <thead className={darkMode ? 'table-dark' : 'table-light'}>
                  <tr>
                    <th><input type="checkbox" onChange={handleSelectAll} checked={foods.length > 0 && foods.every(f => selectedFoodIds.includes(f.id))} /></th>
                    <th>#</th>
                    <th>Hình ảnh</th>
                    <th>Tên món</th>
                    <th>Giá</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((f, index) => (
                    <tr key={f.id}>
                      <td><input type="checkbox" checked={selectedFoodIds.includes(f.id)} onChange={() => handleSelectFood(f.id)} /></td>
                      <td>{currentPage * 5 + index + 1}</td>
                      <td><img src={f.imageUrl} alt={f.name} style={{ width: 60, height: 40, objectFit: 'cover' }} /></td>
                      <td>{f.name}</td>
                      <td>{f.price.toLocaleString()} đ</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFood(f.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ReactPaginate
                pageCount={totalPages}
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
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FoodCategoryForm;

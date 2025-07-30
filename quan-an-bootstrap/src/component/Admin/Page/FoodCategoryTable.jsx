import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import '../css/FoodCategoryPagination.css';
import Sidebar from './Sidebar';
import { deleteCategory, getAllCategories } from './../../../be/Admin/category/category.api';
import { toast, ToastContainer } from 'react-toastify';


const FoodCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 20;
  const navigate = useNavigate();

 useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    };

    fetchData();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredCategories.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

const handleDelete = async (id) => {
  if (!window.confirm('Bạn có chắc chắn muốn xoá danh mục này?')) return;

  try {
    const res = await deleteCategory(id);
    if (res.code === 200) {
      toast.success(res.message);
      // Cập nhật lại danh sách categories (tùy thuộc vào bạn fetch lại hay filter)
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } else {
      toast.error(res.message || 'Xoá danh mục thất bại');
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Xoá danh mục thất bại. Vui lòng thử lại!');
  }
};

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Danh mục món ăn</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={() => navigate('/admin/food-categories/add')}>
            <i className="bi bi-plus-circle me-2"></i>Thêm danh mục
          </button>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-tags-fill me-2"></i>Danh mục món ăn
            </h5>

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Tên danh mục</th>
                  <th>Người tạo</th>
                  <th>Ngày tạo</th>
                  <th>Cập nhật gần nhất</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">Không có dữ liệu</td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{offset + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.createdBy}</td>
                      <td>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                      <td>{moment(item.updatedAt).format('DD/MM/YYYY HH:mm')}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigate(`/admin/food-categories/detail/${item.id}`)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => navigate(`/admin/food-categories/edit/${item.id}`)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <ReactPaginate
              pageCount={pageCount}
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
      <ToastContainer/>
    </div>
  );
};

export default FoodCategoryTable;   
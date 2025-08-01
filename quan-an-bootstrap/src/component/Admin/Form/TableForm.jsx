import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Sidebar from '../Page/Sidebar';
import { DarkModeContext } from '../DarkModeContext';
import { ToastContainer, toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import ReactPaginate from 'react-paginate';
import { addTable, getTableById, updateTable } from '../../../be/Admin/Tables/Table.api';
import BookingLookupModal from '../Modal/BookingLookupModal';

const TableForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  const isEdit = mode === 'edit';
  const isDetail = mode === 'detail';

  const [table, setTable] = useState({
    tableNumber: '',
    capacity: '',
    status: '',
    location: '',
    isDeleted: false,
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: '',
    additionalImages: []
  });

  const [bookingData, setBookingData] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    results: []
  });

  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading,setLoading] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);

  const fetchDetail = async (page) => {
    try {
      const res = await getTableById(id, page, bookingData.pageSize);
      if (res?.table) {
        setTable(prev => ({
          ...prev,
          ...res.table,
          additionalImages: res.table.images || []
        }));
        if (res.bookings) {
          setBookingData(res.bookings);
        }
      } else {
        toast.error('Không tìm thấy bàn!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi gọi API!');
    }
  };

  useEffect(() => {
    if (isDetail || isEdit) {
      fetchDetail(bookingData.currentPage);
    }
  }, [id, isDetail, bookingData.currentPage]);

  const handlePageChange = ({ selected }) => {
    setBookingData(prev => ({ ...prev, currentPage: selected + 1 }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTable(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImageFiles(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setTable(prev => ({
      ...prev,
      additionalImages: [...prev.additionalImages, ...previews]
    }));
  };

  const handleRemoveAdditionalImage = (index) => {
    setTable(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleReplaceAdditionalImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newPreview = URL.createObjectURL(file);
      setTable(prev => {
        const updated = [...prev.additionalImages];
        updated[index] = newPreview;
        return { ...prev, additionalImages: updated };
      });
      setAdditionalImageFiles(prev => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const fetchImageAsFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('TableNumber', table.tableNumber);
    formData.append('Capacity', table.capacity);
    formData.append('Status', table.status || 'Available');
    if (table.location) formData.append('Location', table.location);

    // Ảnh phụ
    if (additionalImageFiles.length > 0) {
      additionalImageFiles.forEach((file) => {
        formData.append('Images', file);
      });
    } else {
      for (let i = 0; i < table.additionalImages.length; i++) {
        const file = await fetchImageAsFile(table.additionalImages[i], `sub-${i}.jpg`);
        formData.append('Images', file);
      }
    }

    if (mode === 'add') {
      const res = await addTable(formData);
      if (res.isSuccess && res.code === 200) {
        toast.success(res.message || '✅ Thêm bàn thành công');
        setTimeout(() => navigate('/admin/tables'), 1000);
      } else {
        toast.error(res.message || '❌ Thêm bàn thất bại!');
      }
    } else if (mode === 'edit') {
      const res = await updateTable(id, formData);
      if (res.isSuccess && res.code === 200) {
        toast.success(res.message || '✅ Cập nhật bàn thành công');
        setTimeout(() => navigate('/admin/tables'), 1000);
      } else {
        toast.error(res.message || '❌ Cập nhật bàn thất bại!');
      }
    }
  } catch (error) {
    console.error('Lỗi khi thêm/cập nhật bàn:', error);
    toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
  } finally {
    setLoading(false);
  }
};

  const allImages = [...table.additionalImages];

  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav>
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
        <li className="breadcrumb-item"><a href="/admin/tables">Danh sách bàn ăn</a></li>
         <li className={`breadcrumb-item active ${darkMode ? 'sidebar-dark bg-dark text-light' : 'sidebar-light bg-white text-dark'}`} aria-current="page">
          {mode === 'add' && 'Thêm bàn ăn'}
          {mode === 'edit' && `Chỉnh sửa bàn #${id}`}
          {mode === 'detail' && `Chi tiết bàn #${id}`}
        </li>
      </ol>
    </nav>

        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/tables')}>
          ← Quay lại danh sách
        </button>

        <div className={`card shadow-sm  ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>
          <div className="card-body">
            <h4 className="mb-4 text-dark">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              {mode === 'add' && 'Thêm bàn mới'}
              {mode === 'edit' && 'Chỉnh sửa bàn'}
              {mode === 'detail' && 'Chi tiết bàn'}
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Số bàn</label>
                <input className="form-control" name="tableNumber" value={table.tableNumber} onChange={handleChange} disabled={isDetail} />
              </div>

              <div className="mb-3">
                <label className="form-label">Sức chứa</label>
                <input className="form-control" name="capacity" type="number" value={table.capacity} onChange={handleChange} disabled={isDetail} />
              </div>

              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <input className="form-control" name="status" value={table.status} onChange={handleChange} disabled={isDetail} />
              </div>

              <div className="mb-3">
                <label className="form-label">Vị trí</label>
                <input className="form-control" name="location" value={table.location} onChange={handleChange} disabled={isDetail} />
              </div>
              
              <div className="form-check form-switch mb-4">
                <input className="form-check-input" type="checkbox" name="isDeleted" checked={table.isDeleted} onChange={handleChange} disabled={isDetail} />
                <label className="form-check-label">Đã xoá (ẩn)</label>
              </div>

              {!isDetail && (
                <div className="mb-3">
                  <label className="form-label">Ảnh phụ</label>
                  <input type="file" multiple accept="image/*" className="form-control" onChange={handleAdditionalImagesUpload} />
                </div>
              )}

              <div className="d-flex flex-wrap gap-2 mb-4">
                {table.additionalImages.map((img, i) => (
                  <div key={i} className="position-relative" style={{ width: 100, height: 100 }}>
                    <img
                      src={img}
                      alt={`img-${i}`}
                      className="rounded border w-100 h-100"
                      style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                      onClick={() => { setLightboxIndex(i); setIsLightboxOpen(true); }}
                    />
                    {!isDetail && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 p-1"
                          onClick={() => handleRemoveAdditionalImage(i)}
                          style={{ borderRadius: '50%' }}
                        >
                          <i className="bi bi-x-lg" style={{ fontSize: '0.7rem' }}></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-light position-absolute bottom-0 start-50 translate-middle-x"
                          onClick={() => document.getElementById(`replace-input-${i}`).click()}
                          style={{ borderRadius: '50%' }}
                        >
                          <i className="bi bi-pencil-fill text-primary"></i>
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          id={`replace-input-${i}`}
                          style={{ display: 'none' }}
                          onChange={(e) => handleReplaceAdditionalImage(e, i)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {(isEdit || isDetail) && (
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Ngày tạo</label>
                    <div className="form-control-plaintext">{moment(table.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                    <label className="form-label">Tạo bởi</label>
                    <div className="form-control-plaintext">{table.createdBy}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cập nhật</label>
                    <div className="form-control-plaintext">{moment(table.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
                    <label className="form-label">Cập nhật bởi</label>
                    <div className="form-control-plaintext">{table.updatedBy}</div>
                  </div>
                </div>
              )}

             {!isDetail && (
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  mode === 'add' ? 'Thêm bàn' : 'Cập nhật'
                )}
              </button>
            )}

            </form>

           {isDetail && (
  <div className="mt-5">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0 text-dark">
        <i className="bi bi-clock-history me-2"></i>Lịch sử đặt bàn
      </h5>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => setShowLookupModal(true)}
      >
        <i className="bi bi-search me-1"></i>Tra cứu đơn đặt bàn
      </button>
    </div>

    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Mã đơn hàng</th>
          <th>Tên KH</th>
          <th>Email</th>
          <th>Điện thoại</th>
          <th>Số khách</th>
          <th>Thời gian</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {bookingData?.results?.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center">Không có lượt đặt nào</td>
          </tr>
        ) : (
          bookingData.results.map((b, i) => (
            <tr key={b.id}>
              <td>{(bookingData.currentPage - 1) * bookingData.pageSize + i + 1}</td>
              <td>{b.bookingCode}</td>
              <td>{b.customerName}</td>
              <td>{b.customerEmail}</td>
              <td>{b.customerPhone}</td>
              <td>{b.guestCount}</td>
              <td>{moment(b.bookingTime).format('DD/MM/YYYY HH:mm')}</td>
              <td>{b.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => navigate(`/admin/bookings/detail/${b.id}`)}
                >
                  <i className="bi bi-eye me-1"></i>Xem
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {bookingData.totalPages > 1 && (
      <ReactPaginate
        pageCount={bookingData.totalPages}
        onPageChange={handlePageChange}
        forcePage={bookingData.currentPage - 1}
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
)}

          </div>
        </div>
      </div>
      {isLightboxOpen && (
        <Lightbox
          mainSrc={allImages[lightboxIndex]}
          nextSrc={allImages[(lightboxIndex + 1) % allImages.length]}
          prevSrc={allImages[(lightboxIndex + allImages.length - 1) % allImages.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + allImages.length - 1) % allImages.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % allImages.length)}
        />
      )}
      <ToastContainer />
      <BookingLookupModal show={showLookupModal} onHide={() => setShowLookupModal(false)} />
    </div>
  );
};

export default TableForm;

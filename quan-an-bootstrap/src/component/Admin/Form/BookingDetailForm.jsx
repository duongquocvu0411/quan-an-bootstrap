import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import Sidebar from '../Page/Sidebar';
import ReactPaginate from 'react-paginate';
import { getBookingDetailById } from '../../../be/Admin/Tables/Table.api';
import OrderModal from '../Modal/OrderModal';
import { toast, ToastContainer } from 'react-toastify';
import { updateBookingStatus } from '../../../be/Admin/Booking/Booking.api';
import { DarkModeContext } from '../DarkModeContext';

const BOOKING_STATUSES = ['Booked', 'CheckedIn', 'Completed', 'Cancelled'];
const ORDER_STATUSES = ['Ordered', 'Cooking', 'Served', 'Canceled'];

const BookingDetail = () => {
  const { id } = useParams(); // bookingId
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const {darkMode} = useContext(DarkModeContext);

  const [booking, setBooking] = useState(null);
  const [orders, setOrders] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    results: []
  });

  const [showOrderModal, setShowOrderModal] = useState(false);

  // UI state cho chỉnh sửa trạng thái
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState('');

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [tempOrderStatus, setTempOrderStatus] = useState('');

  const fetchBookingDetail = async (bookingId, page) => {
    try {
      const data = await getBookingDetailById(bookingId, page, orders.pageSize);
      setBooking(data.booking);
      setOrders(data.orders);
      // đồng bộ tempStatus khi load
      if (data?.booking?.status) setTempStatus(data.booking.status);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết booking:', error);
    }
  };

  useEffect(() => {
    fetchBookingDetail(id, orders.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, orders.currentPage]);

  const handlePageChange = ({ selected }) => {
    setOrders(prev => ({
      ...prev,
      currentPage: selected + 1
    }));
  };

  // Sau khi gọi món thành công, refetch danh sách
  const handleSaveOrder = async () => {
    try {
      await fetchBookingDetail(Number(id), orders.currentPage);
      toast.success('Đã cập nhật danh sách gọi món!');
    } catch (err) {
      console.error('Lỗi khi cập nhật sau gọi món:', err);
      toast.error('Không thể làm mới dữ liệu đơn gọi món.');
    }
  };

  // Handlers chỉnh sửa trạng thái (tĩnh)
  const startEditStatus = () => {
    setTempStatus(booking?.status || 'Booked');
    setIsEditingStatus(true);
  };

  const cancelEditStatus = () => {
    setTempStatus(booking?.status || 'Booked');
    setIsEditingStatus(false);
    toast.info('Đã hủy thay đổi trạng thái');
  };

 const confirmEditStatus = async () => {
  if (isUpdatingStatus) return;
  setIsUpdatingStatus(true);

  try {
    // gọi backend
    const res = await updateBookingStatus(Number(id), tempStatus);
    // có thể kiểm tra res.isSuccess/res.code nếu backend trả về
    setBooking(prev => ({ ...prev, status: tempStatus }));
    setIsEditingStatus(false);
    toast.success(res?.message || `Cập nhật trạng thái thành công: ${tempStatus}`);
  } catch (err) {
    toast.error(err?.message || 'Cập nhật trạng thái thất bại');
  } finally {
    setIsUpdatingStatus(false);
  }
};


  // xữ lý chuyển trạng thái order 
  const startEditOrderStatus = (orderId, currentStatus) => {
  setEditingOrderId(orderId);
  setTempOrderStatus(currentStatus);
};

const cancelEditOrderStatus = () => {
  setEditingOrderId(null);
  setTempOrderStatus('');
  toast.info('Đã huỷ chỉnh sửa trạng thái món ăn');
};

const confirmEditOrderStatus = (orderId) => {
  setOrders(prev => ({
    ...prev,
    results: prev.results.map(order =>
      order.id === orderId ? { ...order, status: tempOrderStatus } : order
    )
  }));
  setEditingOrderId(null);
  setTempOrderStatus('');
  toast.success(`Đã cập nhật trạng thái món #${orderId} thành: ${tempOrderStatus}`);
};


const handleDeleteOrder = (orderId) => {
  if (!window.confirm(`Bạn có chắc chắn muốn xoá món ăn #${orderId}?`)) return;

  setOrders(prev => ({
    ...prev,
    results: prev.results.filter(order => order.id !== orderId),
    totalCount: prev.totalCount - 1
  }));

  toast.success(`Đã xoá món ăn #${orderId} khỏi danh sách`);
};



  if (!booking) return <div className="p-4">Đang tải dữ liệu...</div>;

  const Breadcrumbs = () => {
    if (from === 'booking-list') {
      return (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/bookings">Đơn đặt bàn</Link>
            </li>
            <li className={`breadcrumb-item active ${darkMode ? 'sidebar-dark bg-dark text-light' : 'sidebar-light bg-white text-dark'}`} aria-current="page">
              Booking #{id}
            </li>
          </ol>
        </nav>
      );
    }

    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/tables">Chi tiết Bàn ăn</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/admin/tables/detail/${booking.tableId}`}>Bàn #{booking.tableId}</Link>
          </li>
           <li className={`breadcrumb-item active ${darkMode ? 'sidebar-dark bg-dark text-light' : 'sidebar-light bg-white text-dark'}`} aria-current="page">
            Booking #{id}
          </li>
        </ol>
      </nav>
    );
  };

  // Badge màu cho trạng thái
  const renderStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    const map = {
      booked: 'badge bg-info text-dark',
      checkedin: 'badge bg-primary',
      completed: 'badge bg-success',
      cancelled: 'badge bg-danger'
    };
    const cls = map[s] || 'badge bg-secondary';
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <Breadcrumbs />

        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        {(booking.status === 'Booked' || booking.status === 'CheckedIn') && (
          <button className="btn btn-success mb-3 ms-2" onClick={() => setShowOrderModal(true)}>
            + Gọi món
          </button>
        )}

        <div className="card">
          <div className="card-body">
            <h4 className="mb-4 text-dark">
              <i className="bi bi-person-lines-fill me-2"></i>Thông tin đặt bàn
            </h4>

            <p><strong>Mã đơn Booking:</strong> {booking.bookingCode}</p>
            <p><strong>Khách hàng:</strong> {booking.customerName}</p>
            <p><strong>Thời gian:</strong> {moment(booking.bookingTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Số khách:</strong> {booking.guestCount}</p>

            {/* Trạng thái + nút edit */}
       <div className="mb-2 d-flex align-items-center gap-2">
        <strong>Trạng thái:</strong>
        {!isEditingStatus ? (
          <>
            {renderStatusBadge(booking.status)}
            {/* Ẩn nút sửa nếu Cancelled hoặc Completed */}
            {!(booking.status === 'Cancelled' || booking.status === 'Completed') && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
                onClick={startEditStatus}
                title="Chỉnh sửa trạng thái"
              >
                <i className="bi bi-pencil-square me-1"></i>
              </button>
            )}
          </>
        ) : (
          <div className="d-flex align-items-center flex-wrap gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 180 }}
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              disabled={isUpdatingStatus}
            >
              {BOOKING_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className="btn btn-primary btn-sm d-inline-flex align-items-center"
              onClick={confirmEditStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="bi bi-check2 me-1"></i> Cập nhật
                </>
              )}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={cancelEditStatus}
              disabled={isUpdatingStatus}
            >
              Hủy
            </button>
          </div>
        )}
      </div>

            <p><strong>Ghi chú:</strong> {booking.note || '(Không có)'}</p>

            <h5 className="mt-4 text-dark">
              <i className="bi bi-list-ul me-2"></i>Đơn gọi món
            </h5>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Tên món</th>
                  <th>Số lượng</th>
                  <th>Giá (VND)</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
             <tbody>
  {orders.results.map((o, i) => (
    <tr key={o.id}>
      <td>{(orders.currentPage - 1) * orders.pageSize + i + 1}</td>
      <td>{o.foodName}</td>
      <td>{o.quantity}</td>
      <td>{o.priceAtOrder.toLocaleString()}</td>
      <td>
        {editingOrderId === o.id ? (
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              value={tempOrderStatus}
              onChange={(e) => setTempOrderStatus(e.target.value)}
            >
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {/* Chỉ hiển thị nút nếu trạng thái cho phép */}
            {!(booking.status === 'Completed' || booking.status === 'Cancelled') && (
              <>
                <button className="btn btn-sm btn-primary" onClick={() => confirmEditOrderStatus(o.id)}>
                  <i className="bi bi-check2"></i>
                </button>
                <button className="btn btn-sm btn-secondary" onClick={cancelEditOrderStatus}>
                  <i className="bi bi-x"></i>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <span>{o.status}</span>
            {!(booking.status === 'Completed' || booking.status === 'Cancelled') && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => startEditOrderStatus(o.id, o.status)}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
            )}
          </div>
        )}
      </td>
      <td>
        {!(booking.status === 'Completed' || booking.status === 'Cancelled') && (
          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteOrder(o.id)}>
            <i className="bi bi-trash"></i>
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

            </table>

            {orders.totalPages > 1 && (
              <ReactPaginate
                pageCount={orders.totalPages}
                onPageChange={handlePageChange}
                forcePage={orders.currentPage - 1}
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

        {/* Modal Gọi món */}
        <OrderModal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          onSave={handleSaveOrder}
          bookingId={Number(id)}
        />
      </div>
      <ToastContainer/>
    </div>
  );
};

export default BookingDetail;

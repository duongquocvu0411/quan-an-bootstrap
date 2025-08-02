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
import { deleteMultipleOrders, updateTableOrdersStatus } from '../../../be/Admin/Booking/Order.api';
import PaymentModal from '../Modal/PaymentModal';

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
  const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
 
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

const confirmEditOrderStatus = async (orderId) => {
  if (isUpdatingOrderStatus) return;  // Tránh gọi nhiều lần khi đang cập nhật
  setIsUpdatingOrderStatus(true);  // Đặt trạng thái đang cập nhật

  try {
    // Gọi hàm cập nhật trạng thái món ăn từ backend
    const res = await updateTableOrdersStatus(orderId, tempOrderStatus);

    // Nếu cập nhật thành công, cập nhật trạng thái trong local state
    setOrders(prev => ({
      ...prev,
      results: prev.results.map(order =>
        order.id === orderId ? { ...order, status: tempOrderStatus } : order
      )
    }));

    // Reset trạng thái chỉnh sửa
    setEditingOrderId(null);
    setTempOrderStatus('');

    // Thông báo thành công
    toast.success(res.message || `Đã cập nhật trạng thái món #${orderId} thành: ${tempOrderStatus}`);
  } catch (err) {
    // Nếu có lỗi, thông báo lỗi
    toast.error(err?.message || 'Cập nhật trạng thái món ăn thất bại');
  } finally {
    // Đặt trạng thái không còn đang cập nhật
    setIsUpdatingOrderStatus(false);
  }
};




const handleDeleteOrder = async (orderId) => {
  if (!window.confirm(`Bạn có chắc chắn muốn xoá món ăn #${orderId}?`)) return;

  try {
    setDeletingIds(prev => [...prev, orderId]);

    const res = await deleteMultipleOrders([orderId]); // { orderIds: [id] }

    if (res?.isSuccess) {
      setOrders(prev => ({
        ...prev,
        results: prev.results.filter(order => order.id !== orderId),
        totalCount: Math.max(0, (prev.totalCount || 0) - 1),
      }));
      // DÙNG message từ backend (vd: "Đã xoá: 0. Bị bỏ qua: [9] (Served...)")
      toast.success(res.message || `Đã xoá món ăn #${orderId}`);
    } else {
      toast.error(res?.message || 'Xoá món ăn thất bại');
    }
  } catch (err) {
    const msg = err?.message || 'Có lỗi xảy ra khi xoá món ăn';
    toast.error(msg);
  } finally {
    setDeletingIds(prev => prev.filter(id => id !== orderId));
  }
};



const handleSelectAll = () => {
    const allOrderIds = orders.results.map(order => order.id);
    const allSelected = allOrderIds.every(id => selectedOrders.includes(id));
    setSelectedOrders(allSelected ? [] : allOrderIds);
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev => (
      prev.includes(id)
        ? prev.filter(orderId => orderId !== id)
        : [...prev, id]
    ));
  };

const handleDeleteSelected = async () => {
  if (selectedOrders.length === 0) {
    toast.info('Vui lòng chọn ít nhất một món ăn để xoá.');
    return;
  }

  if (!window.confirm(`Bạn có chắc chắn muốn xoá ${selectedOrders.length} món ăn đã chọn?`)) return;

  try {
    const res = await deleteMultipleOrders(selectedOrders); // { orderIds: [...] }

    if (res?.isSuccess) {
      setOrders(prev => ({
        ...prev,
        results: prev.results.filter(order => !selectedOrders.includes(order.id)),
        totalCount: Math.max(0, (prev.totalCount || 0) - selectedOrders.length),
      }));
      setSelectedOrders([]);
      // DÙNG message từ backend (vd: "Yêu cầu: 3. Đã xoá: 2. Bị bỏ qua: [9] ...")
      toast.success(res.message || 'Đã xoá các món ăn đã chọn');
    } else {
      toast.error(res?.message || 'Xoá thất bại');
    }
  } catch (error) {
    const msg = error?.message || 'Có lỗi xảy ra khi xoá các món ăn đã chọn';
    toast.error(msg);
  }
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
      cancelled: 'badge bg-danger',
       ordered: 'badge bg-warning text-dark',  // Đặt món (màu vàng)
      cooking: 'badge bg-info text-white',    // Đang chế biến (màu xanh dương)
     served: 'badge bg-success text-white',  // Đã phục vụ (màu xanh lá cây)
    };
    const cls = map[s] || 'badge bg-secondary';
    return <span className={cls}>{status}</span>;
  };

  const isServed = (s) => String(s || '').trim().toLowerCase() === 'served';


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
             {selectedOrders.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>Đã chọn {selectedOrders.length} món ăn</span>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected}>
              Xoá các món đã chọn
            </button>
          </div>
        )}
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                    <th>
                    <input
                      type="checkbox"
                      checked={orders.results.length > 0 && orders.results.every((order) => selectedOrders.includes(order.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th>Tên món</th>
                  <th>Số lượng</th>
                  <th>Giá (VND)</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
             <tbody>
              {orders.results.map((o, i) => (
                <tr key={o.id}>
                  <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(o.id)}
                        onChange={() => handleSelectOrder(o.id)}
                      />
                    </td>
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
                        <span>   {renderStatusBadge(o.status)}</span>
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
                  <td>{o.note}</td>
                <td>
                {!(
                    booking.status === 'Completed' ||
                    booking.status === 'Cancelled' ||
                    isServed(o.status)
                  ) && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteOrder(o.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                )}
              </td>
                </tr>
              ))}

              </tbody>

            </table>
            {(booking.status === 'Booked' || booking.status === 'CheckedIn') && (
                <div className="text-end mt-3">
                  <button className="btn btn-warning" onClick={() => setShowPaymentModal(true)}>
                    <i className="bi bi-credit-card me-2"></i> Thanh toán
                  </button>
                </div>
              )}

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

        <PaymentModal
      show={showPaymentModal}
      onHide={() => setShowPaymentModal(false)}
      bookingId={Number(id)}
    />
          </div>
      <ToastContainer/>
    </div>
  );
};

export default BookingDetail;

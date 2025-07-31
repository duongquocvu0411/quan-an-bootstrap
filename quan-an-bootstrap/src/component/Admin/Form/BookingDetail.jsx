import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import Sidebar from './../Page/Sidebar';
import ReactPaginate from 'react-paginate';
import { getBookingDetailById } from '../../../be/Admin/Tables/Table.api';

const BookingDetail = () => {
  const { id } = useParams(); // bookingId
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [orders, setOrders] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    results: []
  });

  const fetchBookingDetail = async (bookingId, page) => {
    try {
      const data = await getBookingDetailById(bookingId, page, orders.pageSize);
      setBooking(data.booking);
      setOrders(data.orders);
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

  if (!booking) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        {/* Breadcrumb cập nhật */}
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
            <li className="breadcrumb-item active" aria-current="page">
              Booking #{id}
            </li>
          </ol>
        </nav>

        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <div className="card">
          <div className="card-body">
            <h4 className="mb-4"><i className="bi bi-person-lines-fill me-2"></i>Thông tin đặt bàn</h4>
            <p><strong>Khách hàng:</strong> {booking.customerName}</p>
            <p><strong>Thời gian:</strong> {moment(booking.bookingTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Số khách:</strong> {booking.guestCount}</p>
            <p><strong>Trạng thái:</strong> {booking.status}</p>
            <p><strong>Ghi chú:</strong> {booking.note || '(Không có)'}</p>

            <h5 className="mt-4"><i className="bi bi-list-ul me-2"></i>Đơn gọi món</h5>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Tên món</th>
                  <th>Số lượng</th>
                  <th>Giá (VND)</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.results.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">Không có món nào</td></tr>
                ) : (
                  orders.results.map((o, i) => (
                    <tr key={o.id}>
                      <td>{(orders.currentPage - 1) * orders.pageSize + i + 1}</td>
                      <td>{o.foodName}</td>
                      <td>{o.quantity}</td>
                      <td>{o.priceAtOrder.toLocaleString()}</td>
                      <td>{o.status}</td>
                    </tr>
                  ))
                )}
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
      </div>
    </div>
  );
};

export default BookingDetail;

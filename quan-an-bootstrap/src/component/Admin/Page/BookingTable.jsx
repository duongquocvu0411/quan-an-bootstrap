// BookingTable.jsx
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { getAllBookings } from '../../../be/Admin/Booking/Booking.api';

const BookingTable = () => {
  const [data, setData] = useState({ results: [], currentPage: 1, pageSize: 10, totalCount: 0, totalPages: 0 });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Gọi API lấy danh sách booking
  const fetchBookings = async (page = 1, pageSize = 10) => {
    try {
      const res = await getAllBookings(page, pageSize);
      setData(res);
      // Khi đổi trang, bỏ chọn các checkbox để tránh mismatch
      setSelectedBookings([]);
    } catch (error) {
      toast.error('Không thể tải danh sách booking');
    }
  };

  useEffect(() => {
    fetchBookings(currentPage + 1, data.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Reset về trang 1 khi thay đổi filter/tìm kiếm và clear selection
  useEffect(() => {
    setCurrentPage(0);
    setSelectedBookings([]);
  }, [selectedStatus, searchTerm]);

  const handleDelete = (id) => {
    // Chưa có backend => chỉ thông báo
    toast.info('Chức năng xoá đang phát triển');
  };

  const handleDeleteSelected = () => {
    if (selectedBookings.length === 0) return;
    // Chưa có backend => chỉ thông báo
    toast.info('Chức năng xoá nhiều đang phát triển');
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredByStatus = selectedStatus
    ? data.results.filter(b => b.status === selectedStatus)
    : data.results;

  const filtered = normalizedSearch
    ? filteredByStatus.filter(b => {
        const haystack = [
          b.bookingCode,
          b.customerName,
          b.customerEmail,
          b.customerPhone
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      })
    : filteredByStatus;

  const pageCount = data.totalPages || 1;
  const offset = currentPage * data.pageSize;
  const currentItems = filtered.slice(offset, offset + data.pageSize);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBookings(currentItems.map(b => b.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedBookings(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item active" aria-current="page">Đơn đặt bàn</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
          <div className="d-flex gap-2 align-items-center" style={{flexWrap:'wrap'}}>
            <select
              className="form-select"
              style={{minWidth: 220}}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value=''>-- Tất cả trạng thái --</option>
              <option value='Booked'>Booked</option>
              <option value='CheckedIn'>CheckedIn</option>
              <option value='Completed'>Completed</option>
              <option value='Canceled'>Canceled</option>
            </select>

            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm mã đơn, tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{minWidth: 320}}
            />
          </div>

          <div className="text-muted small">
            Trang {data.currentPage}/{data.totalPages} • Tổng: <strong>{data.totalCount}</strong> đơn
          </div>
        </div>

        {selectedBookings.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>Đã chọn {selectedBookings.length} đơn</span>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected}>
              Xoá các đơn đã chọn
            </button>
          </div>
        )}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-journal-text me-2"></i>Đơn đặt bàn
            </h5>

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th><input type="checkbox" onChange={handleSelectAll} checked={currentItems.length>0 && selectedBookings.length === currentItems.length} /></th>
                  <th>#</th>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Thời gian</th>
                  <th>Số khách</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr><td colSpan="10" className="text-center">Không có dữ liệu</td></tr>
                ) : (
                  currentItems.map((b, index) => (
                    <tr key={b.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(b.id)}
                          onChange={() => handleSelectRow(b.id)}
                        />
                      </td>
                      <td>{offset + index + 1}</td>
                      <td>{b.bookingCode}</td>
                      <td>{b.customerName}</td>
                      <td>{b.customerEmail}</td>
                      <td>{b.customerPhone}</td>
                      <td>{moment(b.bookingTime).format('DD/MM/YYYY hh:mm A')}</td>
                      <td>{b.guestCount}</td>
                      <td>{b.status}</td>
                      <td>
                        <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() =>
                                navigate(`/admin/bookings/detail/${b.id}`, {
                                state: { from: 'booking-list' }
                                })
                            }
                            >
                            <i className="bi bi-eye"></i>
                            </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(b.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {pageCount > 1 && (
              <ReactPaginate
                pageCount={pageCount}
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
                forcePage={Math.min(currentPage, pageCount - 1)}
              />
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingTable;

// src/pages/Dashboard.jsx
import React, { useContext } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../css/Dashboard.css';
import Sidebar from './../Sidebar';
import { DarkModeContext } from '../../DarkModeContext';


const Dashboard = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const revenueData = {
    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'],
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: [45, 52, 38, 60, 72, 58, 80],
        backgroundColor: darkMode ? '#ffc107' : '#cda45e',
      },
    ],
  };

  const orderPieData = {
    labels: ['Món chính', 'Salad', 'Đặc biệt'],
    datasets: [
      {
        data: [120, 90, 45],
        backgroundColor: ['#cda45e', '#6c757d', '#ffc107'],
      },
    ],
  };

  const lineData = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    datasets: [
      {
        label: 'Doanh thu 7 ngày',
        data: [12, 14, 8, 17, 20, 22, 25],
        fill: false,
        borderColor: darkMode ? '#ffc107' : '#cda45e',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="d-flex">
      <Sidebar />

      {/* Main content */}
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
            <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
          </ol>
        </nav>

        {/* Toggle dark/light mode */}
        {/* <div className="d-flex justify-content-end mb-3">
          <button
            className={`btn btn-toggle ${darkMode ? 'btn-warning' : 'btn-outline-dark'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <i className={`bi ${darkMode ? 'bi-brightness-high-fill' : 'bi-moon-fill'} me-2`}></i>
            {darkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}
          </button>
        </div> */}

        <h2 className={`mb-4 text-center ${darkMode ? 'text-light' : 'text-dark'}`}>
          <i className="bi bi-speedometer2 me-2"></i>Dashboard Quản Lý Quán Ăn
        </h2>

        {/* Quick Stats */}
        <div className="row mb-4">
          {[ 
            { icon: 'bi-basket-fill', label: 'Đơn hàng hôm nay', value: '158' },
            { icon: 'bi-currency-dollar', label: 'Doanh thu hôm nay', value: '12.5 triệu' },
            { icon: 'bi-people-fill', label: 'Khách đặt bàn', value: '34' },
            { icon: 'bi-star-fill', label: 'Món bán chạy', value: 'Bún bò' },
          ].map((stat, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className={`card shadow h-100 stat-card ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>
                <div className="card-body">
                  <h5 className="stat-label"><i className={`bi ${stat.icon} me-2`}></i>{stat.label}</h5>
                  <h3 className="stat-value" style={{ color: darkMode ? '#ffc107' : '#cda45e' }}>
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center">
                  <i className="bi bi-bar-chart-fill me-2"></i>Doanh thu theo tháng
                </h5>
                <div className="chart-container"><Bar data={revenueData} /></div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center">
                  <i className="bi bi-pie-chart-fill me-2"></i>Tỉ lệ món ăn
                </h5>
                <div className="chart-container"><Pie data={orderPieData} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng bán chạy */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h5 className="card-title"><i className="bi bi-award-fill me-2"></i>Món ăn bán chạy</h5>
            <table className="table table-hover table-bordered">
              <thead className={darkMode ? 'table-dark' : 'table-light'}>
                <tr><th>Món ăn</th><th>Số lượng</th><th>Giá</th></tr>
              </thead>
              <tbody>
                <tr><td>Phở bò</td><td>120</td><td>45,000đ</td></tr>
                <tr><td>Bún chả</td><td>95</td><td>50,000đ</td></tr>
                <tr><td>Bánh mì</td><td>75</td><td>25,000đ</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Chart */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h5 className="card-title text-center">
              <i className="bi bi-graph-up-arrow me-2"></i>Doanh thu 7 ngày gần nhất
            </h5>
            <div className="chart-container"><Line data={lineData} /></div>
          </div>
        </div>

        {/* Đặt bàn hôm nay */}
        <div className="card shadow mb-5">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-calendar-check-fill me-2"></i>Đặt bàn hôm nay
            </h5>
            <table className="table table-bordered table-hover">
              <thead className={darkMode ? 'table-dark' : 'table-light'}>
                <tr><th>Tên khách</th><th>Giờ</th><th>Bàn</th><th>Trạng thái</th></tr>
              </thead>
              <tbody>
                <tr><td>Nguyễn Văn A</td><td>18:30</td><td>Bàn 4</td><td><span className="badge bg-success">Đã đến</span></td></tr>
                <tr><td>Trần Thị B</td><td>19:00</td><td>Bàn 2</td><td><span className="badge bg-warning text-dark">Đang chờ</span></td></tr>
                <tr><td>Lê Văn C</td><td>20:00</td><td>Bàn 6</td><td><span className="badge bg-danger">Huỷ</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
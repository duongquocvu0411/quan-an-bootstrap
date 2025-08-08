// src/components/Sidebar.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/Sidebar.css';
import { DarkModeContext } from '../DarkModeContext';
import { toast } from 'react-toastify';
import useRoles from '../../hook/useRoles';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { darkMode, setDarkMode, autoMode, setAutoMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const roles = useRoles();
  const isAdmin = roles.includes('Admin');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove('roles');
    Cookies.remove('token');
    toast.success('Đăng xuất thành công');
    setTimeout(() => {
      navigate('/admin/login');
    }, 1000);
  };

  const menuItems = [
    { to: '/admin/dashboard', label: 'Trang chủ', icon: 'bi-house-door-fill' },
    { to: '/admin/food-categories', label: 'Category', icon: 'bi-egg-fried' },
    { to: '/admin/foods', label: 'Món ăn', icon: 'bi-cup-straw' },
    { to: '/admin/bookings', label: 'Đơn hàng', icon: 'bi-file-earmark-spreadsheet' },
    { to: '/admin/tables', label: 'Đặt bàn', icon: 'bi-calendar-check' },
    { to: '/admin/bank-accounts', label: 'Cấu hình tài khoản thanh toán', icon: 'bi-bank' },
    { to: '/admin/contact-users', label: 'Liên hệ người dùng', icon: 'bi-chat-dots' },
    { to: '/admin/about-admin', label: 'Giới thiệu', icon: 'bi-info-circle' }, 
    { to: '/admin/features', label: 'Đặc trưng', icon: 'bi-stars' }
  ];

  if (isAdmin) {
    menuItems.push({
      to: '/admin/contact-admin',
      label: 'Liên hệ admin',
      icon: 'bi-person-bounding-box',
    });
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        className="btn btn-dark position-fixed top-50 start-0 translate-middle-y toggle-sidebar-btn rounded-end"
        onClick={toggleSidebar}
        title={isOpen ? 'Ẩn menu' : 'Hiện menu'}
      >
        <i className={`bi ${isOpen ? 'bi-chevron-left' : 'bi-list'} fs-5`}></i>
      </button>

      {/* Sidebar */}
      <div
        className={`custom-sidebar shadow-lg ${darkMode ? 'sidebar-dark bg-dark text-light' : 'sidebar-light bg-white text-dark'} ${isOpen ? 'open' : 'closed'}`}
      >
        <div className="sidebar-header text-center py-4 border-bottom border-secondary">
          <h5 className={`mb-0 ${darkMode ? 'text-light' : 'text-dark'}`}>
            <i className="bi bi-shop me-2"></i>
            {isOpen && 'Quản lý Quán Ăn'}
          </h5>
        </div>

        <ul className="nav flex-column mt-3">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center px-3 py-2 rounded mb-1 fw-medium ${
                  location.pathname === item.to
                    ? 'active bg-opacity-75 bg-primary text-white'
                    : 'text-reset'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          {/* Dark mode + auto switch */}
          <li className="nav-item px-3 mt-3">
            <div className="d-flex flex-column gap-2">
              <button
                className={`btn w-100 d-flex align-items-center justify-content-start rounded shadow-sm ${
                  darkMode ? 'btn-warning text-dark' : 'btn-outline-dark'
                }`}
                onClick={() => setDarkMode(!darkMode)}
                disabled={autoMode}
              >
                <i className={`bi ${darkMode ? 'bi-brightness-high-fill' : 'bi-moon-fill'} me-2`}></i>
                {isOpen && (darkMode ? 'Chế độ Sáng' : 'Chế độ Tối')}
              </button>

              <div className="form-check form-switch ms-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoDarkModeSwitch"
                  checked={autoMode}
                  onChange={() => setAutoMode(!autoMode)}
                />
                <label className="form-check-label" htmlFor="autoDarkModeSwitch">
                  {isOpen ? 'Tự động theo giờ (UTC)' : 'Auto'}
                </label>
              </div>
            </div>
          </li>

          {/* Logout button */}
          <li className="nav-item px-3 mt-3">
            <button
              className="btn btn-danger w-100 d-flex align-items-center justify-content-start rounded shadow-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              {isOpen && 'Đăng xuất'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

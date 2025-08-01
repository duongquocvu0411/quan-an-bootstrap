// src/components/Sidebar.jsx
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';
import { DarkModeContext } from '../DarkModeContext';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
          <h5 className={`mb-0 ${darkMode ? 'sidebar-dark bg-dark text-light' : 'sidebar-light bg-white text-dark'} `}>
            <i className="bi bi-shop me-2"></i>
            {isOpen && 'Quản lý Quán Ăn'}
          </h5>
        </div>

        <ul className="nav flex-column mt-3">
          {[
            { to: '/admin/dashboard', label: 'Trang chủ', icon: 'bi-house-door-fill' },
            { to: '/admin/food-categories', label: 'Category', icon: 'bi-egg-fried' },
            { to: '/admin/foods', label: 'Món ăn', icon: 'bi-cup-straw' },
            { to: '/admin/bookings', label: 'Đơn hàng', icon: 'bi-file-earmark-spreadsheet' },
            { to: '/admin/tables', label: 'Đặt bàn', icon: 'bi-calendar-check' },
          ].map((item) => (
            <li className="nav-item" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center px-3 py-2 rounded mb-1 fw-medium ${
                  location.pathname === item.to ? 'active bg-opacity-75 bg-primary text-white' : 'text-reset'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          {/* Toggle Dark Mode inside sidebar menu */}
          <li className="nav-item px-3 mt-3">
            <button
              className={`btn w-100 d-flex align-items-center justify-content-start rounded shadow-sm ${darkMode ? 'btn-warning text-dark' : 'btn-outline-dark'}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <i className={`bi ${darkMode ? 'bi-brightness-high-fill' : 'bi-moon-fill'} me-2`}></i>
              {isOpen && (darkMode ? 'Chế độ Sáng' : 'Chế độ Tối')}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
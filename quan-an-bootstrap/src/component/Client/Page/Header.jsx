import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Header() {
  const location = useLocation();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  // Helper để check route hiện tại
  const isActive = (path) => location.pathname === path;

  // Hàm để bật/tắt menu trên di động
  const handleMobileNavToggle = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  // Sử dụng useEffect để thêm/xóa class vào body khi trạng thái mobile nav thay đổi
  // Đây là cách các template thường dùng để hiển thị menu mobile
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.classList.add('mobile-nav-active');
    } else {
      document.body.classList.remove('mobile-nav-active');
    }

    // Cleanup: Xóa class khi component bị unmount
    return () => {
      document.body.classList.remove('mobile-nav-active');
    };
  }, [isMobileNavOpen]);


  return (
    <header id="header" className="header fixed-top">
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:contact@example.com">contact@example.com</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+1 5589 55488 55</span>
            </i>
          </div>
          <div className="languages d-none d-md-flex align-items-center">
            <ul>
              <li>En</li>
              <li><a href="#">De</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <Link to="/" className="logo d-flex align-items-center me-auto me-xl-0">
            <h1 className="sitename">Restaurantly</h1>
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
              </li>
              <li>
                <a href="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`} >About</a>
              </li>
              <li>
                <a href="/menu" className={`nav-link ${isActive("/menu") ? "active" : ""}`} >Menu</a>
              </li>
              <li>
                <a href="/specials" className={`nav-link ${isActive("/specials") ? "active" : ""}`} >Specials</a>
              </li>
              <li>
                <a href="/event" className={`nav-link ${isActive("/event") ? "active" : ""}`} >Events</a>
              </li>
              <li>
                <a href="/chefs" className={`nav-link ${isActive("/chefs") ? "active" : ""}`} >Chefs</a>
              </li>
              <li>
                <a href="gallery" className={`nav-link ${isActive("/gallery") ? "active" : ""}`} >Gallery</a>
              </li>
              <li>
                 <Link
                  className={`nav-link ${isActive("/contact") ? "active" : ""}`}
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
            {/* Sửa đổi ở đây: Thêm onClick và thay đổi class động */}
            <i 
              className={`mobile-nav-toggle d-xl-none bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`}
              onClick={handleMobileNavToggle}
            />
          </nav>

          <Link
            className={`btn-book-a-table d-none d-xl-block  ${isActive("/booking") ? "active" : ""}`}
            to="/booking"
          >
            Book a Table
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
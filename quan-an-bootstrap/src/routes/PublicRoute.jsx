import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setChecking(false);
      return;
    }

    axios.post(`${API_URL}/admin/authenticate/verify-token`, { token })
      .then(res => {
        if (res.data?.isSuccess) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) return null; // hoặc spinner

  // ✅ Nếu đã login, redirect về dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  //  Nếu chưa login → hiển thị form login
  return children;
};

export default PublicRoute;

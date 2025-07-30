import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // loading trong lúc kiểm tra

    useEffect(() => {
        const token = Cookies.get('token');

        if (!token) {
            navigate('/admin/login');
            return;
        }

        axios.post(`${API_URL}/admin/authenticate/verify-token`, { token })
            .then(res => {
                if (!res.data.isSuccess) {
                    handleLogout();
                } else {
                    // Optionally: lưu lại info user ở context/global store
                    setLoading(false);
                }
            })
            .catch(() => {
                handleLogout();
            });

        function handleLogout() {
            Cookies.remove('token');
            Cookies.remove('roles');
            navigate('/admin/login');
        }
    }, [navigate]);

    if (loading) return null; // hoặc <LoadingSpinner />

    return <Outlet />;
};

export default ProtectedRoute;

// src/hook/useRoleGuard.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useRoleGuard = (allowedRoles = [], enabled = true) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!enabled) return;

        try {
            const raw = Cookies.get('roles');
            const roles = raw ? JSON.parse(raw) : [];

            const hasAccess = roles.some(role => allowedRoles.includes(role));
            if (!hasAccess) {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error('Invalid roles cookie format', err);
            navigate('/admin/dashboard');
        }
    }, [allowedRoles, enabled, navigate]);
};

export default useRoleGuard;

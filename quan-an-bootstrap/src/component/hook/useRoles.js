// src/hooks/useRoles.js
import Cookies from 'js-cookie';

const useRoles = () => {
    try {
        const roleCookie = Cookies.get('roles');
        if (!roleCookie) return [];

        const roles = JSON.parse(roleCookie);
        return Array.isArray(roles) ? roles : [roles];
    } catch (error) {
        console.error('Failed to parse roles from cookie:', error);
        return [];
    }
};

export default useRoles;

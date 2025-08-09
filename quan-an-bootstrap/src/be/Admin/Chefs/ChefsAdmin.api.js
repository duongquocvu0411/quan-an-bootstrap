import axios from 'axios';
import { getAuthHeader } from '../../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL;

export const getChefs = async (pageNumber = 1, pageSize = 10, isActive = true, token) => {
    try {
        const res = await axios.get(`${API_URL}/chefs`, {
            params: {
                pageNumber,
                pageSize,
                isActive,
            },
            headers: {
                ...getAuthHeader(),
                Accept: '*/*',
            },
        });

        return res.data; // { isSuccess, code, message, data: {currentPage, pageSize, totalCount, totalPages, results} }
    } catch (error) {
        return {
            isSuccess: false,
            message: error?.response?.data?.message || 'Lỗi kết nối server',
            data: null,
        };
    }
};


export const getChefById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/chefs/${id}`, {
            headers: {
                ...getAuthHeader(),
                Accept: '*/*',
            },
        });

        return res.data;
    } catch (error) {
        return {
            isSuccess: false,
            message: error?.response?.data?.message || 'Lỗi kết nối server',
            data: null,
        };
    }
};



export async function createChefsAdmin(formData) {
    try {
        const response = await axios.post(`${API_URL}/chefs/create`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo mới Chefs:', error);
        throw error;
    }
}



export async function updateChefsAdmin(formData) {
    try {
        const response = await axios.put(`${API_URL}/chefs/update`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật Chef:', error);
        throw error;
    }
}


export async function deleteChefsAdmin(ids = []) {
    try {
        const response = await axios.delete(`${API_URL}/chefs/delete`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            data: ids
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi xoá tính năng:', error);
        throw error;
    }
}
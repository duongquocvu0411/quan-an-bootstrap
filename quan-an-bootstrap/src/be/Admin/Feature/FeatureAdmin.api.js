import axios from "axios";
import { getAuthHeader } from './../../utils/authHeader';




const API_URL = process.env.REACT_APP_API_URL;

export async function getAllFeatureAdmins(page = 1, pageSize = 10, isActive = true) {
    try {
        const response = await axios.get(`${API_URL}/features`, {
            params: { page, pageSize, isActive },
            headers: {
                ...getAuthHeader()
            }
        });

        return response.data?.data || { results: [], totalPages: 0 };
    } catch (error) {
        console.error('Lỗi khi gọi API getAllFeatureAdmins:', error);
        throw error;
    }
}


export async function getFeatureById(id) {
    try {
        const response = await axios.get(`${API_URL}/features/${id}`, {
            headers: {
                ...getAuthHeader()
            }
        });

        if (response?.data?.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response?.data?.message || 'Không thể lấy chi tiết feature');
        }
    } catch (error) {
        console.error('Lỗi khi gọi API getFeatureById:', error);
        throw error;
    }
}



export async function createFeatureAdmin(formData) {
    try {
        const response = await axios.post(`${API_URL}/features/create`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo mới feature:', error);
        throw error;
    }
}


export async function updateFeatureAdmin(id, formData) {
    try {
        const response = await axios.put(`${API_URL}/features/Update?id=${id}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật tính năng:", error);
        throw error.response?.data || error;
    }
}


export async function deleteFeatureAdmin(ids = []) {
    try {
        const response = await axios.delete(`${API_URL}/features/delete`, {
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

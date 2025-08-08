import axios from "axios";
import { getAuthHeader } from './../../utils/authHeader';
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;


export const getAllContactAdmins = async (page = 1, pageSize = 10, isActive = true) => {
    try {
        const response = await axios.get(
            `${API_URL}/contact-admin/admins?page=${page}&pageSize=${pageSize}&isactive=${isActive}`,
            {
                headers: {
                    ...getAuthHeader(),
                    Accept: '*/*',
                },
            }
        );

        if (response.data?.isSuccess && response.data?.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || 'Lỗi lấy danh sách liên hệ admin');
        }
    } catch (error) {
        console.error('Lỗi API getAllContactAdmins:', error);
        throw error;
    }
};


// xem chi tiết 
export const getContactAdminById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/contact-admin/${id}`, {
            headers: {
                ...getAuthHeader(),
                Accept: '*/*',
            },
        });

        if (response.data?.isSuccess && response.data?.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || 'Không tìm thấy thông tin liên hệ');
        }
    } catch (error) {
        console.error(`Lỗi API getContactAdminById(${id}):`, error);
        throw error;
    }
};



// post


export const createContactAdmin = async (formData) => {
    try {
        const response = await axios.post(
            `${API_URL}/contact-admin/create`,
            formData,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating contact admin:', error);
        throw error?.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const updateContactAdmin = async (id, formData) => {
    try {
        const response = await axios.put(
            `${API_URL}/contact-admin/update/${id}`,
            formData,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error update contact admin:', error);
        throw error?.response?.data || { message: 'Lỗi không xác định' };
    }
};


export const deleteContactAdmin = async (ids) => {
    try {
        const response = await axios.delete(
            `${API_URL}/contact-admin/delete`,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                data: ids,
            }
        );

        return response.data;
    } catch (error) {
        const errMsg = error?.response?.data?.message || 'Lỗi không xác định khi xóa.';
        throw error?.response?.data || { message: errMsg };
    }
};





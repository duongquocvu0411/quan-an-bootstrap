

import axios from 'axios';
import { getAuthHeader } from './../../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL;


export const getAllContactUsers = async (pageNumber = 1, pageSize = 10, isReplied = false) => {
    try {
        const response = await axios.get(
            `${API_URL}/contact-user/paged?pageNumber=${pageNumber}&pageSize=${pageSize}&isReplied=${isReplied}`,
            { headers: getAuthHeader() }
        );

        if (response.data?.isSuccess && response.data?.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || 'Lỗi lấy dữ liệu liên hệ');
        }
    } catch (error) {
        console.error('Lỗi API getAllContactUsers:', error);
        throw error;
    }
};

// xem chi tiết 

export const getContactUserById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/contact-user/${id}`, {
            headers: {
                ...getAuthHeader()
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi gọi API getContactUserById:', error);
        return {
            isSuccess: false,
            code: 500,
            message: 'Lỗi khi gọi API',
            data: null
        };
    }
};


// phản hồi 

export const replyToContactUser = async (payload) => {

    try {

        const res = await axios.post(`${API_URL}/contact-user/reply`, payload, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            }
        });
        return res.data;

    } catch (err) {
        throw err.response?.data || { message: "Lỗi không xác định khi phản hồi." };
    }
}




// delete 

export const deleteManyContactUsers = async (ids = []) => {
    try {

        const res = await axios.delete(`${API_URL}/contact-user`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: ids // gữi body dạng json mảng
        });

        if (res.data?.isSuccess && res.data?.code === 200) {
            return res.data;
        } else {
            throw new Error(res.data?.message || "Lỗi xóa liên hệ");
        }

    } catch (err) {
        console.error('Lỗi Api deleteManyContactUsers', err);
        throw err;
    }
}

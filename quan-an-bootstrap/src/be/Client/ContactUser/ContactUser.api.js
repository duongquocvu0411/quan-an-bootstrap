import axios from "axios";



const API_URL = process.env.REACT_APP_API_URL;

// hàm gữi liên hệ cho phía user

export const createContactUser = async (contactData) => {
    const res = await axios.post(`${API_URL}/contact-user`, contactData);

    return res.data;
}

export const getActiveContactAdmins = async () => {
    try {
        const response = await axios.get(`${API_URL}/contact-admin/Client`);
        const res = response.data;

        if (res?.isSuccess) {
            return res.data || [];
        } else {
            throw new Error(res.message || 'Lấy dữ liệu liên hệ thất bại');
        }
    } catch (error) {
        console.error('Error fetching active contact admins:', error);
        throw error?.response?.data || { message: 'Lỗi không xác định khi lấy danh sách liên hệ' };
    }
};
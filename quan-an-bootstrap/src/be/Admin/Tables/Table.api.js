import axios from "axios";
import { getAuthHeader } from './../../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL;



export const getAllTables = async (page = 1, pageSize = 10, isDeleted = false) => {
    try {
        const response = await axios.get(
            `${API_URL}/table?page=${page}&pageSize=${pageSize}&isDeleted=${isDeleted}`,

        );

        if (response.data?.isSuccess && response.data?.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || 'Lỗi lấy dữ liệu bàn');
        }
    } catch (error) {
        console.error('Lỗi API getAllTables:', error);
        throw error;
    }
};


export const getTableById = async (id, page = 1, pageSize = 10) => {
    try {
        const res = await axios.get(
            `${API_URL}/table/${id}?page=${page}&pageSize=${pageSize}`,

        );

        if (res.data?.isSuccess && res.data?.code === 200) {
            return res.data.data; // Trả về object gồm { table, bookings }
        } else {
            throw new Error(res.data?.message || 'Lỗi lấy chi tiết bàn');
        }
    } catch (err) {
        console.error('Lỗi khi gọi getTableById:', err);
        throw err;
    }
};


export const getBookingDetailById = async (bookingId, page = 1, pageSize = 10) => {
    try {
        const res = await axios.get(
            `${API_URL}/table/booking/${bookingId}/orders?page=${page}&pageSize=${pageSize}`,
            { headers: getAuthHeader() }
        );

        if (res.data?.isSuccess && res.data?.code === 200) {
            return res.data.data; // { booking: {...}, orders: {...} }
        } else {
            throw new Error(res.data?.message || 'Lỗi khi lấy chi tiết booking');
        }
    } catch (err) {
        console.error('Lỗi API getBookingDetailById:', err);
        throw err;
    }
};


export const addTable = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/table/create`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi thêm bàn ăn:', error);
        throw error;
    }
};

export const updateTable = async (id, formData) => {
    try {

        const res = await axios.put(`${API_URL}/table/update/${id}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data || null;
    } catch (error) {
        console.error(`Lỗi khi cập bàn ăn  ID = ${id}:`, error);
        throw error;
    }
}


// xóa mềm 
export const softDeleteTable = async (id) => {
    try {
        const res = await axios.patch(`${API_URL}/table/soft-delete/${id}`, null, {
            headers: getAuthHeader(),
        });

        return res.data; // Trả về { isSuccess, code, message }
    } catch (error) {
        console.error(`Lỗi khi xoá mềm bàn ID = ${id}:`, error);
        throw error;
    }
};

// khôi phục xóa mềm 
export const restoreTable = async (id) => {
    try {
        const res = await axios.patch(`${API_URL}/table/restore/${id}`, null, {
            headers: getAuthHeader(),
        });

        if (res.data?.isSuccess && res.data?.code === 200) {
            return res.data;
        } else {
            throw new Error(res.data?.message || 'Khôi phục bàn không thành công');
        }
    } catch (error) {
        console.error(`Lỗi khi khôi phục bàn ID = ${id}:`, error);
        throw error;
    }
};


// xóa vĩnh viên

export const deleteTablePermanently = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/table/delete/${id}`, {
            headers: getAuthHeader(),
        });

        if (res.data?.isSuccess && res.data?.code == 200) {
            return res.data;
        }
        else {
            throw new Error(res.data?.message || 'Xóa vĩnh viễn thất bại')
        }
    } catch (err) {
        console.error(`Lỗi khi xoá vĩnh viễn bàn ID = ${id}:`, err);
        throw err;
    }
}
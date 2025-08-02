import axios from 'axios';
import { getAuthHeader } from '../../utils/authHeader';


const API_URL = process.env.REACT_APP_API_URL;


export const createTableOrder = async (payload) => {
    try {
        const response = await axios.post(
            `${API_URL}/table-order/create`,
            payload,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data; // { isSuccess, code, message, data: { orderIds: [...] } }
    } catch (error) {
        console.error(' Lỗi khi gọi món:', error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
};

export const updateTableOrdersStatus = async (orderId, status) => {
    try {
        const res = await axios.put(
            `${API_URL}/table-order/update-status`,
            {
                id: orderId,
                status: status
            },
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.data;

    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái món ăn:', err?.response?.data || err.message);
        throw err?.response?.data || err;
    }
}


export const deleteMultipleOrders = async (orderIds) => {
    try {
        const response = await axios.delete(
            `${API_URL}/table-order/delete-multiple`,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                // body đặt trong config.data
                data: { orderIds },
            }
        );
        return response.data; // ResponseDTO { isSuccess, code, message, data? }
    } catch (error) {
        // ném lại message backend để UI hiển thị đúng
        const errPayload = error?.response?.data || { message: error?.message || 'Request error' };
        console.error('Lỗi khi xóa nhiều đơn hàng:', errPayload);
        throw errPayload;
    }
};


// tạo qr 

export const createPaymentQrForBooking = async (bookingId) => {
    try {
        const response = await axios.post(
            `${API_URL}/payment-qr/create-for-booking/${bookingId}`,
            {}, // body rỗng
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                    Accept: '*/*'
                }
            }
        );

        return response.data; // { isSuccess, code, message, data: { qrImageUrl, finalNote } }
    } catch (error) {
        const errPayload = error?.response?.data || { message: error?.message || 'Lỗi không xác định khi tạo QR' };
        console.error('Lỗi khi tạo mã QR thanh toán:', errPayload);
        throw errPayload;
    }
};
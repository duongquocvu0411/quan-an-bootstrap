// src/be/Admin/Payment/payment.api.js

import axios from 'axios';
import { getAuthHeader } from '../../utils/authHeader';


const API_URL = process.env.REACT_APP_API_URL;

// lấy logo của ngân hàng 
let bankInfoCache = null;

export const getBankLogoUrl = async (bankBin) => {
    // Nếu đã có cache, lấy từ cache
    if (!bankInfoCache) {
        try {
            const res = await axios.get('https://api.vietqr.io/v2/banks');
            bankInfoCache = res.data?.data || [];
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ngân hàng VietQR:', error);
            return null;
        }
    }

    const bank = bankInfoCache.find((b) => b.bin === bankBin);
    return bank?.logo || null;
};


export const getActiveBankAccounts = async () => {
    try {
        const res = await axios.get(`${API_URL}/payment-qr-accounts/active`, {
            headers: {
                ...getAuthHeader(),
                Accept: '*/*'
            }
        });
        return res.data?.data || [];
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản ngân hàng:', error);
        return [];
    }
};




// get danh sách bannking admin

export const getAllPaymentQrAccounts = async (page = 1, pageSize = 10, isActive = null) => {
    try {
        const params = { page, pageSize };
        if (isActive !== null) params.isActive = isActive;

        const res = await axios.get(`${API_URL}/payment-qr-accounts`, {
            params,
            headers: getAuthHeader(),
        });

        if (res.data?.isSuccess) {
            return res.data.data;
        } else {
            throw new Error(res.data?.message || 'Lỗi lấy danh sách tài khoản ngân hàng QR');
        }
    } catch (error) {
        console.error('getAllPaymentQrAccounts error:', error);
        throw error;
    }
};

export const getPaymentQrById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/payment-qr-accounts/${id}`, {
            headers: getAuthHeader()
        });

        if (response?.data?.isSuccess && response?.data?.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response?.data?.message || 'Không thể lấy dữ liệu tài khoản QR');
        }
    } catch (error) {
        console.error('getPaymentQrById error:', error);
        throw error;
    }
};



export const createPaymentQrAccount = async (payload) => {
    const response = await axios.post(
        `${API_URL}/payment-qr-accounts/create`,
        payload,
        { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
    );

    if (response?.data?.isSuccess && response?.data?.code === 200) {
        return response.data;
    } else {
        throw new Error(response?.data?.message || 'Tạo tài khoản thất bại');
    }
};


export const updatePaymentQrAccount = async (id, data) => {
    const res = await axios.put(`${API_URL}/payment-qr-accounts/update/${id}`, data, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
    });
    return res.data;
};


export const deletePaymentQrAccounts = async (ids) => {
    const res = await axios.delete(`${API_URL}/payment-qr-accounts/delete`, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
        data: ids,
    });
    return res.data;
};
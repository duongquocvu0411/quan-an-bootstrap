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
import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;

// Lấy danh sách đặc trưng đang hoạt động (dành cho client)
export const getClientFeatureList = async () => {
    try {
        const res = await axios.get(`${API_URL}/features/client`);

        return res.data;
    } catch (error) {
        return {
            isSuccess: false,
            message: error?.response?.data?.message || 'Lỗi kết nối server',
            data: null
        };
    }
};

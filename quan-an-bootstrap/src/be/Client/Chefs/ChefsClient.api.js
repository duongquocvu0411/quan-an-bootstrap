import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllChefsClient = async () => {
    try {
        const res = await axios.get(`${API_URL}/chefs/client`);

        return {
            isSuccess: res.data?.isSuccess ?? false,
            message: res.data?.message ?? '',
            data: res.data?.data ?? []
        };
    } catch (error) {
        console.error("Lỗi khi gọi API getAllChefsClient:", error);

        return {
            isSuccess: false,
            message: error?.response?.data?.message || 'Lỗi kết nối server',
            data: []
        };
    }
};

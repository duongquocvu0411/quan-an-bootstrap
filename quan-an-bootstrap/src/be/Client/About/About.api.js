import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;


export const getAllAboutClient = async () => {
    try {
       

        const response = await axios.get(`${API_URL}/about/client`, {
            headers: {
                Accept: '*/*',
            },
        });

        const res = response.data;

        if (res?.isSuccess) {
            return res.data || [];
        } else {
            throw new Error(res.message || 'Lấy dữ liệu About thất bại');
        }
    } catch (error) {
        console.error('Error fetching About content:', error);
        throw error?.response?.data || { message: 'Lỗi không xác định khi lấy dữ liệu About' };
    }
};
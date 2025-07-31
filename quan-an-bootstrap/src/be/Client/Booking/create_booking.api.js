import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";


const API_URL = process.env.REACT_APP_API_URL;


export const createBooking = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/table-booking/create`, formData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi tạo booking:", error);
        throw error;
    }
};
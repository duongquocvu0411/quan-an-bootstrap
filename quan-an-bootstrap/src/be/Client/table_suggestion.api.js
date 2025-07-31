import axios from "axios";
import { getAuthHeader } from './../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL;

//  API gợi ý bàn ăn có phân trang
export const getSuggestedTables = async (guestCount, pageNumber = 1, pageSize = 10) => {
    try {
        const res = await axios.post(
            `${API_URL}/table-suggestion?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            { guestCount },
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            }
        );

        // Trả về toàn bộ object phân trang
        return res.data?.data || {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
            results: []
        };
    } catch (error) {
        console.error("Lỗi khi gọi API gợi ý bàn:", error);
        return {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
            results: []
        };
    }
};



export const getTableClientDetailById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/table/${id}/client-detail`, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json"
            }
        });

        // Trả về object table nếu thành công
        return res.data?.data || null;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết bàn ID ${id}:`, error);
        return null;
    }
};

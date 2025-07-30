import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";

const API_URL = process.env.REACT_APP_API_URL;


export const getAllFoods = async (page = 1, pageSize = 20) => {
    try {
        const response = await axios.get(`${API_URL}/list-food?page=${page}&pageSize=${pageSize}`);
        const { data } = response.data;

        return {
            currentPage: data.currentPage,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
            foods: data.results || []
        };
    } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn:', error);
        throw error;
    }
};


export const getFoodById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/food-detail/${id}`);
        const { data } = response.data;

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl,
            categoryId: data.categoryId,
            categoryName: data.categoryName,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy ?? 'Admin', // fallback nếu không có
            additionalImages: data.foodImages?.additionalImages || [],
            detailDescription: data.detail?.description || '',
            ingredients: data.detail?.ingredients || '',
            cookingMethod: data.detail?.cookingMethod || '',
            calories: data.detail?.calories || 0,
            preparationTimeMinutes: data.detail?.preparationTimeMinutes || 0
        };
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết món ăn ID = ${id}:`, error);
        throw error;
    }
};


export const addFood = async (formData) => {
    try {

        const res = await axios.post(`${API_URL}/create-food`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi thêm món ăn:', error);
        throw error;
    }
}


export const updateFood = async (id, formData) => {
    try {

        const res = await axios.put(`${API_URL}/update-food/${id}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data || null;
    } catch (error) {
        console.error(`Lỗi khi cập nhật món ăn ID = ${id}:`, error);
        throw error;
    }
}

export const deleteFoods = async (ids) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-food`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: { ids }
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa món ăn:', error);
        throw error;
    }
};

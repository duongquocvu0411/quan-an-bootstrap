import axios from "axios";
import { getAuthHeader } from '../../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL;
const pageSize = 20;

export const getAllCategories = async () => {
    const res = await axios.get(`${API_URL}/admin/food-category`);
    return res.data?.data || [];
};




export const getCategoryDetail = async (categoryId, page = 1, pageSize = 5) => {
    const res = await axios.get(`${API_URL}/admin/food-category/category-foods/${categoryId}?page=${page}&pageSize=${pageSize}`);
    const data = res.data?.data;

    const result = data?.results?.[0] || {};
    return {
        category: result?.category || {},
        foods: result?.foods || [],
        totalPages: data?.totalPages || 1,
        currentPage: data?.currentPage || 1,
    };
};


export const getFoodsByCategory = async (categoryId, page = 1) => {
    const url = `${API_URL}/admin/food-category/category-foods/${categoryId}?page=${page}&pageSize=${pageSize}`;
    const res = await axios.get(url);
    const data = res.data?.data;

    const result = data?.results?.[0] || {};
    const categoryName = result?.category?.name?.toLowerCase() || "";
    let filterClass = "filter-specialty";
    if (categoryName.includes("starter")) filterClass = "filter-starters";
    else if (categoryName.includes("salad")) filterClass = "filter-salads";

    const foods = result?.foods?.map(food => ({
        ...food,
        filterClass,
    })) || [];

    return {
        foods,
        totalPages: data?.totalPages || 1,
    };
};



export const addCategory = async (category) => {
    try {
        const res = await axios.post(`${API_URL}/admin/food-category`, category, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
        });
        return res.data; // return toàn bộ response để lấy code, message, data
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        throw error;
    }
};


// put 
export const updateCategory = async (id, data) => {
    try {
        const res = await axios.put(
            `${API_URL}/admin/food-category/${id}`,
            data,
            { headers: getAuthHeader() }
        );
        return res.data; // return đầy đủ để lấy code, message
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/admin/food-category/${id}`, {
            headers: getAuthHeader()
        });

        return res.data; // có: { isSuccess, code, message }
    } catch (error) {
        console.error('Lỗi khi xoá danh mục:', error);
        throw error;
    }
};
// delete


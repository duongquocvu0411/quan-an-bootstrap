import axios from 'axios';
import { getAuthHeader } from './../../utils/authHeader';


const API_URL = process.env.REACT_APP_API_URL;



export const getAdminAboutList = async (page = 1, pageSize = 10, isActive = true) => {
  try {
    const res = await axios.get(`${API_URL}/about/admin`, {
      params: { page, pageSize, isActive },
      headers: {
        ...getAuthHeader(),
      }
    });
    return res.data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error?.response?.data?.message || 'Lỗi kết nối server',
      data: null
    };
  }
};



export const getAboutById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/about/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return res.data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error?.response?.data?.message || 'Lỗi kết nối server',
      data: null,
    };
  }
};

// Hàm gọi API để tạo mới About
export const createAbout = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/about/create`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới About:', error);
    throw error.response?.data || { message: 'Lỗi không xác định' };
  }
};


export const updateAbout = async (id, formData) => {
  try {
    const res = await axios.put(
      `${API_URL}/about/update?id=${id}`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Update about failed", error);
    return {
      isSuccess: false,
      message: error.response?.data?.message || 'Lỗi khi cập nhật giới thiệu',
    };
  }
};


export const deleteAboutItems = async (ids = []) => {
  try {
    const res = await axios.delete(`${API_URL}/about/delete`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      data: ids 
    });

    return res.data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error?.response?.data?.message || 'Lỗi khi xóa bản ghi',
      data: null
    };
  }
};
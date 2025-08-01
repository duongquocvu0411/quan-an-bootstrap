import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";


const API_URL = process.env.REACT_APP_API_URL;




export const getAllBookings = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/table-booking/list?page=${page}&pageSize=${pageSize}`,
      {
        headers: getAuthHeader(),
      }
    );
    const result = response.data;
    if (result.isSuccess && result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || "Lỗi không xác định khi lấy danh sách booking");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getAllBookings:", error);
    throw error;
  }
};



export const lookupBooking = async (payload) => {
  try {
    const res = await axios.post(`${API_URL}/table-booking/look-up`, payload, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tra cứu đơn đặt bàn:", error);
    throw error;
  }
};



export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const res = await axios.put(
      `${API_URL}/table-booking/update-status`,
      {
        bookingId,
        newStatus
      },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json"
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái booking:", error);
    throw error;
  }
};




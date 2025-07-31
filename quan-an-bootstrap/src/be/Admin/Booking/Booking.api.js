import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";


const API_URL = process.env.REACT_APP_API_URL;


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
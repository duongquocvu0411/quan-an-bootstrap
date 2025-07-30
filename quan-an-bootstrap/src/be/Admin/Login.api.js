import axios from 'axios';
import Cookies from 'js-cookie';  // Import thư viện js-cookie

const API_URL = process.env.REACT_APP_API_URL;

// Hàm Login
export const login = async (username, password, rememberMe) => {
    try {
        // Gửi yêu cầu đăng nhập
        const response = await axios.post(`${API_URL}/admin/authenticate/login`, {
            username,
            password,
            rememberMe
        });

        // Kiểm tra phản hồi thành công
        if (response.data.isSuccess) {
            const token = response.data.data.token;
            const roles = JSON.stringify(response.data.data.roles);

            // Lưu token vào cookie mà không cần chỉ định thời gian hết hạn (backend sẽ xử lý)
            Cookies.set('token', token);
            Cookies.set('roles', roles);

            // Trả về kết quả thành công
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } else {
            // Trả về kết quả thất bại
            return { success: false, message: response.data.message || 'Tên đăng nhập hoặc mật khẩu không đúng' };
        }
    } catch (error) {
        // Log lỗi và hiển thị thông báo lỗi kết nối với máy chủ
        console.error('Error during login:', error);

        if (error.response) {
            // Nếu có phản hồi từ backend, trả về thông báo lỗi từ backend
            return { success: false, message: error.response.data.message || 'Lỗi khi kết nối với máy chủ. Vui lòng thử lại sau.' };
        } else {
            // Nếu không có phản hồi từ backend
            return { success: false, message: 'Không thể kết nối với máy chủ. Vui lòng thử lại sau.' };
        }
    }
};

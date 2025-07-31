using BE_Nhahang.DTOS.Admin.Tables.Booking;
using System.Globalization;

namespace BE_Nhahang.Helpers.TemplateEmail
{
    public static class EmailTemplateGenerator
    {
        public static string GenerateForCustomer(TableBookingDTO dto, string bookingCode)
        {
            var date = dto.BookingTime.ToString("HH:mm dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
            return $@"
            <div style='font-family:Segoe UI,Roboto,sans-serif;padding:20px;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;background:#fdfdfd'>
                <h2 style='color:#e67e22;text-align:center'>Xác nhận đặt bàn thành công</h2>
                <p>Xin chào <strong>{dto.CustomerName}</strong>,</p>
                <p>Cảm ơn bạn đã đặt bàn tại <strong>Nhà hàng GSV</strong>. Dưới đây là thông tin đặt bàn của bạn:</p>
                <ul style='line-height:1.8'>
                    <li><strong>Mã đặt bàn:</strong> {bookingCode}</li>
                    <li><strong>Thời gian:</strong> {date}</li>
                    <li><strong>Số lượng khách:</strong> {dto.GuestCount}</li>
                    <li><strong>Số bàn:</strong> #{dto.TableId}</li>
                    <li><strong>Ghi chú:</strong> {dto.Note ?? "Không có"}</li>
                </ul>
                <p style='color:#27ae60'><strong>Chúng tôi rất mong được đón tiếp bạn!</strong></p>
                <p style='font-size:14px;color:#888'>
                    Vui lòng giữ lại <strong>MÃ ĐẶT BÀN</strong> để tra cứu hoặc hủy lịch.
                    Nếu cần hỗ trợ, hãy liên hệ trước ít nhất 2 giờ.
                </p>
            </div>";
        }

        public static string GenerateForSystem(TableBookingDTO dto, string bookingCode)
        {
            var date = dto.BookingTime.ToString("HH:mm dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
            return $@"
            <div style='font-family:Segoe UI,Roboto,sans-serif;padding:20px;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;background:#fff'>
                <h2 style='color:#2c3e50'>Thông báo đặt bàn mới</h2>
                <p>Khách hàng <strong>{dto.CustomerName}</strong> vừa đặt bàn thành công:</p>
                <ul style='line-height:1.8'>
                    <li><strong>Mã đặt bàn:</strong> {bookingCode}</li>
                    <li><strong>Email:</strong> {dto.CustomerEmail}</li>
                    <li><strong>Số điện thoại:</strong> {dto.CustomerPhone}</li>
                    <li><strong>Thời gian:</strong> {date}</li>
                    <li><strong>Số lượng khách:</strong> {dto.GuestCount}</li>
                    <li><strong>Bàn:</strong> #{dto.TableId}</li>
                    <li><strong>Ghi chú:</strong> {dto.Note ?? "Không có"}</li>
                </ul>
                <p style='font-size:13px;color:#999'>Được gửi tự động từ hệ thống đặt bàn GSV</p>
            </div>";
        }
    }
}

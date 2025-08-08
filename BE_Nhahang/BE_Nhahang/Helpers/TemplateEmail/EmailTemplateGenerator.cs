using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.Models.Entities.Contact;
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



        public static string GenerateForSystem(ContactUserModel model)
        {
            return $@"
                <h3>📩 Thông tin liên hệ mới từ khách hàng</h3>
                <table style='font-family: Arial; border-collapse: collapse;'>
                    <tr><td><strong>👤 Họ tên:</strong></td><td>{model.YourName}</td></tr>
                    <tr><td><strong>📧 Email:</strong></td><td>{model.Email}</td></tr>
                    <tr><td><strong>📞 SĐT:</strong></td><td>{model.Phone}</td></tr>
                    <tr><td><strong>📌 Tiêu đề:</strong></td><td>{model.Subject}</td></tr>
                    <tr><td style='vertical-align: top;'><strong>📝 Nội dung:</strong></td><td>{model.Message}</td></tr>
                </table>
                <hr style='margin: 20px 0;'>
                <p style='color: gray;'>⏰ Gửi lúc: {model.CreatedAt:HH:mm dd/MM/yyyy}</p>";
        }



        public static string GenerateReplyForUser(ContactUserModel contact, string replyMsg)
        {
            return $@"
    <html>
      <head>
        <style>
          body {{
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
          }}
          .container {{
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
          }}
          .header {{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #0056b3;
          }}
          .footer {{
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }}
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>Phản hồi từ Nhà hàng</div>
          <p>Chào <strong>{contact.YourName}</strong>,</p>
          <p>Chúng tôi đã nhận được phản hồi từ bạn với nội dung:</p>
          <blockquote style='background: #fff; border-left: 4px solid #ccc; padding: 10px;'>
            {contact.Message}
          </blockquote>
          <p>Phản hồi của chúng tôi:</p>
          <blockquote style='background: #e6f7ff; border-left: 4px solid #1890ff; padding: 10px;'>
            {replyMsg}
          </blockquote>
          <p>Trân trọng,<br />Đội ngũ hỗ trợ Nhà hàng</p>
          <div class='footer'>
            Email này được gửi tự động, vui lòng không trả lời trực tiếp.
          </div>
        </div>
      </body>
    </html>";
        }


        public static string GenerateReplyForSystem(ContactUserModel contact, string replyMsg)
        {
            return $@"
    <html>
      <head>
        <style>
          body {{
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
          }}
          .container {{
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fffbe6;
          }}
          .header {{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #fa8c16;
          }}
          .section {{
            margin-bottom: 10px;
          }}
          .label {{
            font-weight: bold;
            color: #595959;
          }}
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>Xác nhận phản hồi liên hệ từ Admin</div>

          <div class='section'>
            <span class='label'>Tên người liên hệ:</span> {contact.YourName}
          </div>
          <div class='section'>
            <span class='label'>Email:</span> {contact.Email}
          </div>
          <div class='section'>
            <span class='label'>Tiêu đề:</span> {contact.Subject}
          </div>
          <div class='section'>
            <span class='label'>Nội dung liên hệ:</span><br />
            <blockquote style='background: #fff; border-left: 4px solid #ccc; padding: 10px;'>
              {contact.Message}
            </blockquote>
          </div>
          <div class='section'>
            <span class='label'>Phản hồi từ Admin ({contact.RepliedBy}):</span><br />
            <blockquote style='background: #f0f5ff; border-left: 4px solid #2f54eb; padding: 10px;'>
              {replyMsg}
            </blockquote>
          </div>
          <div class='section'>
            <span class='label'>Thời gian phản hồi:</span> {contact.RepliedAt?.ToString("HH:mm dd/MM/yyyy")}
          </div>
        </div>
      </body>
    </html>";
        }


    }
}

namespace BE_Nhahang.Test.DTOtest
{
    public class CreateVietQrRequestDTO
    {
        /// <summary>Tổng tiền (VND). Bắt buộc > 0.</summary>
        public decimal Amount { get; set; }

        /// <summary>Ghi chú hiển thị vào nội dung chuyển khoản (ví dụ: TABLE-12 hoặc ORDER-2025-08-02-001).</summary>
        public string? Note { get; set; }

        /// <summary>Id bàn (nếu có), phục vụ đối soát.</summary>
        public int? TableId { get; set; }

        /// <summary>Mã đơn/booking (nếu có), phục vụ đối soát.</summary>
        public string? OrderCode { get; set; }
    }

    public class VietQrResponseDTO
    {
        /// <summary>URL ảnh QR (PNG) để nhúng vào UI & hiển thị cho khách quét.</summary>
        public string QrImageUrl { get; set; } = default!;

        /// <summary>Gợi ý nội dung CK (server đã chuẩn hoá) để bạn lưu log/đối soát.</summary>
        public string FinalNote { get; set; } = default!;
    }
}

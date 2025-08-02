using BE_Nhahang.Test.DTOtest;

namespace BE_Nhahang.Test.Inteface
{
    public interface IVietQrService
    {
        /// <summary>
        /// Tạo URL ảnh VietQR (qr_only.png) theo số tiền & nội dung ghi chú.
        /// </summary>
        VietQrResponseDTO GeneratePaymentQr(CreateVietQrRequestDTO req);
    }
}

using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Test.DTOtest;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Test.Inteface
{
    [ApiController]
    [Route("api/v2/payment/vietqr")]
    public class VietQrController : ControllerBase
    {
        private readonly IVietQrService _vietQr;

        public VietQrController(IVietQrService vietQr)
        {
            _vietQr = vietQr;
        }

        /// <summary>
        /// Tạo URL ảnh VietQR để thanh toán (tiền vào thẳng tài khoản cấu hình).
        /// </summary>
        [HttpPost("create")]
        public ActionResult<ResponseDTO<VietQrResponseDTO>> Create([FromBody] CreateVietQrRequestDTO req)
        {
            try
            {
                if (req.Amount <= 0)
                    return new ResponseDTO<VietQrResponseDTO>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "Số tiền phải lớn hơn 0."
                    };

                var data = _vietQr.GeneratePaymentQr(req);
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Tạo QR thanh toán thành công.",
                    Data = data
                };
            }
            catch (ArgumentException ex)
            {
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = ex.Message
                };
            }
            catch (Exception ex)
            {
                // log ex
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Không tạo được QR. Vui lòng thử lại hoặc kiểm tra cấu hình."
                };
            }
        }

        /// <summary>
        /// (Tuỳ chọn) Endpoint GET nhanh để nhúng thẳng ảnh QR trong <img src="...">.
        /// </summary>
        [HttpGet("image")]
        public IActionResult GetImage([FromQuery] decimal amount, [FromQuery] string? note, [FromQuery] string? orderCode, [FromQuery] int? tableId)
        {
            if (amount <= 0) return BadRequest("amount phải > 0");

            var data = _vietQr.GeneratePaymentQr(new CreateVietQrRequestDTO
            {
                Amount = amount,
                Note = note,
                OrderCode = orderCode,
                TableId = tableId
            });

            // redirect đến ảnh VietQR (img.vietqr.io) để <img src="/api/v2/payment/vietqr/image?..."> hoạt động
            return Redirect(data.QrImageUrl);
        }
    }
}
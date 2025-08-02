using BE_Nhahang.Interfaces.Admin.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Pyment
{
    [Route("payment-qr")]
    [ApiController]
    public class PaymentQrController : ControllerBase
    {
        private readonly IPaymentQrService _service;
        private readonly IHttpContextAccessor _http;

        public PaymentQrController(IPaymentQrService service, IHttpContextAccessor http)
        {
            _service = service;
            _http = http;
        }

        [HttpPost("create-for-booking/{bookingId:int}")]
        [Authorize]
        public async Task<IActionResult> CreateForBooking([FromRoute] int bookingId)
        {

            var res = await _service.CreateBookingPaymentQrAsync(bookingId);
            return StatusCode(res.code, res);
        }
    }
}

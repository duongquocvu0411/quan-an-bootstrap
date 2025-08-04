using BE_Nhahang.DTOS.Admin.Payment;
using BE_Nhahang.Interfaces.Admin.Payment.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Pyment
{
    [Route("payment-qr-accounts")]
    [ApiController]
    public class PaymentQrBankAccountController : ControllerBase
    {
        private readonly IPaymentQrBankAccountService _service;

        public PaymentQrBankAccountController(IPaymentQrBankAccountService service)
        {
            _service = service;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var result = await _service.GetAllActiveAsync();
            return Ok(result);
        }

        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10,bool isActive = true)
        {
            var result = await _service.GetAllAsync(page, pageSize, isActive);
            return Ok(new { isSuccess = true, code = 200, message = "Lấy danh sách thành công", data = result });
        }

        [HttpGet("{id}")]
           [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.code, result);
        }

        [HttpPost("create")]
           [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Create( PaymentQrBankAccountDTO dto)
        {
            var success = await _service.CreateAsync(dto);
            return  StatusCode(success.code, success);
        }

        [HttpPut("update/{id}")]
           [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Update(int id,  PaymentQrBankAccountDTO dto)
        {
            var success = await _service.UpdateAsync(id, dto);
            return StatusCode(success.code, success);
        }

        [HttpDelete("delete")]
           [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Delete(List<int> ids)
        {
            var success = await _service.DeleteAsync(ids);
            return StatusCode(success.code, success);
        }
    }
}

using BE_Nhahang.DTOS.Admin.Auth;
using BE_Nhahang.Interfaces.Admin.Auth.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE_Nhahang.Controllers.Admin.Authenicate
{
    [Route("admin/account")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }


        [Authorize]
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _accountService.SendOtpToEmailAsync(userId);
            return StatusCode(result.code, result);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _accountService.ChangePasswordAsync(userId, dto);
            return StatusCode(result.code, result);
        }

        [Authorize(Roles ="Admin,HR")]
        [HttpPost("reset-user-password")]
        public async Task<IActionResult> ResetUserPassword([FromBody] ResetUserPasswordDTO dto)
        {
            var result = await _accountService.ResetPasswordForUserAsync(dto);
            return StatusCode(result.code, result);
        }
    }
}

using BE_Nhahang.DTOS.Jwt;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers;
using BE_Nhahang.Interfaces.Admin.Auth;
using BE_Nhahang.Models.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BE_Nhahang.Controllers.Admin.Authenicate
{
    [Route("admin/authenticate")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthenticateController(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IAuthService authService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _authService = authService;
        }

        /// <summary>
        /// Api đăng nhập hệ thống
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var response = await _authService.LoginAsync(model);
            return StatusCode(response.code, response);
        }

        [HttpPost("verify-token")]
        public ActionResult<ResponseDTO<object>> VerifyToken([FromBody] VerifyTokenRequestDTO request)
        {
            var result = _authService.VerifyToken(request.Token);
            return StatusCode(result.code, result);
        }


        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                return StatusCode(409, new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 409,
                    Message = "Tài khoản đã tồn tại!"
                });
            }

            var user = new IdentityUser
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return StatusCode(500, new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Tạo tài khoản thất bại!"
                });
            }

            // Chỉ tạo các role thật sự dùng
            var roles = new[] {
                UserRoles.Admin,
                UserRoles.Manager,
                UserRoles.Chef,
                UserRoles.Receptionist
            };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Gán role Admin cho người dùng
            await _userManager.AddToRoleAsync(user, UserRoles.Admin);

            return Ok(new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo tài khoản Admin thành công!"
            });
        }



        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Registers model)
        {
            var result = await _authService.RegisterAsync(model);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Api mỡ khóa tài khoản cho nhân viên bị khóa
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        [HttpPut("unlock-account/{username}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> UnlockAccount(string username)
        {
            var result = await _authService.UnlockAccountAsync(username);
            return StatusCode(result.code, result);
        }


        [HttpPost("disable")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<ActionResult<ResponseDTO<string>>> DisableUser([FromQuery] string username)
        {
            var result = await _authService.DisableAccountAsync(username);
            return StatusCode(result.code, result);
        }

    }
}

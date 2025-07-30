using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers;
using BE_Nhahang.Interfaces.Admin.Auth;
using BE_Nhahang.Models.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BE_Nhahang.Services.Admin.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task<ResponseDTO<object>> LoginAsync(LoginModel model)
        {
            // Hỗ trợ đăng nhập bằng username hoặc email
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null && model.Username.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(model.Username);
            }

            if (user == null)
                return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng");

            // Đảm bảo tài khoản bật tính năng Lockout
            if (!await _userManager.GetLockoutEnabledAsync(user))
                await _userManager.SetLockoutEnabledAsync(user, true);

            // Kiểm tra nếu tài khoản đang bị khóa
            if (await _userManager.IsLockedOutAsync(user))
            {
                var lockoutEnd = user.LockoutEnd;

                // Kiểm tra khóa vĩnh viễn (do admin hoặc vượt quá 9 lần sai)
                if (lockoutEnd.HasValue && lockoutEnd.Value >= DateTimeOffset.MaxValue.AddDays(-1) ||
                    lockoutEnd.HasValue && lockoutEnd.Value.Subtract(DateTimeOffset.UtcNow).TotalDays >= 29.9)
                {
                    return Unauthorized("Tài khoản đã bị khóa 30 ngày. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.");
                }

                // Khóa tạm thời
                var remaining = lockoutEnd?.Subtract(DateTimeOffset.UtcNow);
                var msg = remaining.HasValue && remaining.Value.TotalMinutes > 0
                    ? $"Tài khoản bị khóa. Vui lòng thử lại sau {remaining.Value.TotalMinutes:N0} phút."
                    : "Tài khoản đang bị khóa. Vui lòng thử lại sau.";
                return Unauthorized(msg);
            }

            // Nếu đăng nhập đúng
            if (await _userManager.CheckPasswordAsync(user, model.Password))
            {
                await _userManager.ResetAccessFailedCountAsync(user);

                var roles = await _userManager.GetRolesAsync(user);
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

                foreach (var role in roles)
                    claims.Add(new Claim(ClaimTypes.Role, role));
                
                // tính toán thời gian hết hạn token 

                var tokenExpiry = model.RememberMe
                    ? DateTime.Now.AddDays(7) // 7 ngày nếu RememberMe = true
                    : DateTime.Now.AddHours(8);

                var token = JwtTokenHelper.GenerateToken(claims, _configuration,tokenExpiry);

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Login thành công",
                    Data = new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo,
                        roles,
                        rememberMe = model.RememberMe,
                    }
                };
            }
            else
            {
                // Đăng nhập sai → tăng đếm và xử lý khóa
                await _userManager.AccessFailedAsync(user);
                int failed = await _userManager.GetAccessFailedCountAsync(user);

                if (failed == 3)
                {
                    await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddMinutes(10));
                }
                else if (failed == 6)
                {
                    await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddMinutes(30));
                }
                else if (failed >= 9)
                {
                    await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddDays(30));
                    return Unauthorized("Tài khoản đã bị khóa 30 ngày. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.");
                }

                return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng");
            }
        }


        private ResponseDTO<object> Unauthorized(string message)
        {
            return new ResponseDTO<object>
            {
                IsSuccess = false,
                code = 401,
                Message = message
            };
        }



        public async Task<ResponseDTO<object>> RegisterAsync(Registers model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 409,
                    Message = "Tài khoản đã tồn tại!"
                };
            }

            // Kiểm tra role có tồn tại không
            if (!await _roleManager.RoleExistsAsync(model.Role!))
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Role không hợp lệ!"
                };
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
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Tạo tài khoản thất bại!"
                };
            }

            await _userManager.AddToRoleAsync(user, model.Role!);

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Tạo tài khoản thành công với vai trò: {model.Role}"
            };
        }



        // api mỡ khóa tài khoản 
        public async Task<ResponseDTO<object>> UnlockAccountAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy người dùng"
                };
            }

            if (!await _userManager.IsLockedOutAsync(user))
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Tài khoản không bị khóa"
                };
            }

            // Mở khóa & reset số lần sai
            await _userManager.SetLockoutEndDateAsync(user, null);
            await _userManager.ResetAccessFailedCountAsync(user);

            // Lấy lại thông tin mới nhất sau khi reset
            var updatedUser = await _userManager.FindByNameAsync(username);

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tài khoản đã được mở khóa thành công!",
                Data = new
                {
                    Username = updatedUser.UserName,
                    IsLockedOut = await _userManager.IsLockedOutAsync(updatedUser),
                    AccessFailedCount = await _userManager.GetAccessFailedCountAsync(updatedUser)
                }
            };
        }


        public async Task<ResponseDTO<string>> DisableAccountAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return new ResponseDTO<string>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy người dùng"
                };
            }

            // Đảm bảo cho phép khóa tài khoản
            if (!await _userManager.GetLockoutEnabledAsync(user))
                await _userManager.SetLockoutEnabledAsync(user, true);

            // Đặt LockoutEnd thành giá trị tối đa – khóa vĩnh viễn
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);

            return new ResponseDTO<string>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Tài khoản '{username}' đã bị vô hiệu hóa vĩnh viễn.",
                Data = username
            };
        }




        public ResponseDTO<object> VerifyToken(string token)
        {
            var response = new ResponseDTO<object>();

            if (string.IsNullOrEmpty(token))
            {
                response.IsSuccess = false;
                response.code = 400;
                response.Message = "Token không được để trống.";
                return response;
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JWT:ValidIssuer"],

                    ValidateAudience = true,
                    ValidAudience = _configuration["JWT:ValidAudience"],

                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var username = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
                var roles = jwtToken.Claims.Where(c => c.Type == ClaimTypes.Role).Select(r => r.Value).ToList();
                var exp = jwtToken.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;

                response.Data = new
                {
                    userId,
                    username,
                    roles,
                    exp
                };
                response.Message = "Token hợp lệ.";
            }
            catch (SecurityTokenException)
            {
                response.IsSuccess = false;
                response.code = 401;
                response.Message = "Token không hợp lệ hoặc đã hết hạn.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.code = 500;
                response.Message = $"Lỗi server: {ex.Message}";
            }

            return response;
        }
    }

}

using BE_Nhahang.DTOS.Admin.Auth;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.Auth.Account;
using BE_Nhahang.Interfaces.Admin.Sendmail;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;

namespace BE_Nhahang.Services.Admin.Auth.Account
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;
        private readonly ILogger<AccountService> _logger;
        private readonly IEmailSender _emailSender;

        public AccountService(UserManager<IdentityUser> userManager, IConfiguration config, IMemoryCache cache, ILogger<AccountService> logger, IEmailSender emailSender)
        {
            _userManager = userManager;
            _config = config;
            _cache = cache;
            _logger = logger;
            _emailSender = emailSender;
        }

        public async Task<ResponseDTO<object>> SendOtpToEmailAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.Email))
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy người dùng hoặc chưa đăng ký email" };

            string cacheKey = $"OTP_{user.Email}";
            if (_cache.TryGetValue(cacheKey, out OtpStatusDTO existingOtp))
            {
                var waitTime = existingOtp.AttemptCount switch
                {
                    0 => TimeSpan.Zero,
                    1 => TimeSpan.FromSeconds(30),
                    2 => TimeSpan.FromSeconds(90),
                    3 => TimeSpan.FromMinutes(3),
                    _ => TimeSpan.FromMinutes(5)
                };

                if ((DateTime.Now - existingOtp.LastSent) < waitTime)
                    return new ResponseDTO<object> { IsSuccess = false, code = 429, Message = $"Vui lòng đợi {(waitTime - (DateTime.Now - existingOtp.LastSent)).Seconds} giây để gửi lại OTP." };
            }

            var otp = new Random().Next(100000, 999999).ToString();
            var otpDto = new OtpStatusDTO
            {
                Email = user.Email,
                OtpCode = otp,
                LastSent = DateTime.Now,
                Expiration = DateTime.Now.AddMinutes(5),
                AttemptCount = existingOtp?.AttemptCount + 1 ?? 1
            };
            _cache.Set(cacheKey, otpDto, TimeSpan.FromMinutes(10));

            await _emailSender.SendEmailAsync(user.Email, "Xác thực OTP đổi mật khẩu", $"Mã OTP của bạn là: <b>{otp}</b>. Có hiệu lực trong 5 phút.");
            return new ResponseDTO<object> { IsSuccess = true, code = 200, Message = "Mã OTP đã được gửi về email." };
        }

        public async Task<ResponseDTO<object>> ChangePasswordAsync(string userId, ChangePasswordRequestDTO dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy người dùng." };

            string cacheKey = $"OTP_{user.Email}";
            if (!_cache.TryGetValue(cacheKey, out OtpStatusDTO cachedOtp) || cachedOtp.OtpCode != dto.Otp || cachedOtp.Expiration < DateTime.Now)
                return new ResponseDTO<object> { IsSuccess = false, code = 400, Message = "Mã OTP không hợp lệ hoặc đã hết hạn." };

            var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);
            if (!result.Succeeded)
                return new ResponseDTO<object> { IsSuccess = false, code = 400, Message = "Đổi mật khẩu thất bại: " + string.Join(", ", result.Errors.Select(e => e.Description)) };

            _cache.Remove(cacheKey);
            return new ResponseDTO<object> { IsSuccess = true, code = 200, Message = "Mật khẩu đã được thay đổi." };
        }


        // cấp lại mật khẩu 
        public async Task<ResponseDTO<string>> ResetPasswordForUserAsync(ResetUserPasswordDTO dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null || string.IsNullOrEmpty(user.Email))
                return new ResponseDTO<string> { IsSuccess = false, code = 404, Message = "Không tìm thấy tài khoản hoặc chưa có email." };

            string newPassword = GenerateSecurePassword();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!result.Succeeded)
                return new ResponseDTO<string> { IsSuccess = false, code = 400, Message = string.Join(", ", result.Errors.Select(e => e.Description)) };

            var body = $"Mật khẩu mới của bạn là: <b>{newPassword}</b>. Vui lòng đăng nhập và đổi mật khẩu ngay.";
            await _emailSender.SendEmailAsync(user.Email, "Cấp lại mật khẩu đăng nhập", body);

            return new ResponseDTO<string>
            {
                IsSuccess = true,
                code = 200,
                Message = "Đã cấp lại mật khẩu thành công.",
                Data = newPassword
            };
        }

        private string GenerateSecurePassword(int length = 8)
        {
            const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lower = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string special = "@#*!";

            var random = new Random();

            // Bắt buộc mỗi nhóm một ký tự
            var passwordChars = new List<char>
    {
        upper[random.Next(upper.Length)],
        digits[random.Next(digits.Length)],
        special[random.Next(special.Length)],
        lower[random.Next(lower.Length)]
    };

            // Các ký tự còn lại chọn ngẫu nhiên từ tất cả
            string allChars = upper + lower + digits + special;
            int remaining = length - passwordChars.Count;

            for (int i = 0; i < remaining; i++)
            {
                passwordChars.Add(allChars[random.Next(allChars.Length)]);
            }

            // Xáo trộn chuỗi để tránh đoán vị trí predictable
            return new string(passwordChars.OrderBy(x => random.Next()).ToArray());
        }

    }
}


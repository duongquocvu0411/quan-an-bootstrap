using BE_Nhahang.DTOS.Admin.Auth;
using BE_Nhahang.DTOS.Response;

namespace BE_Nhahang.Interfaces.Admin.Auth.Account
{
    public interface IAccountService
    {
        Task<ResponseDTO<object>> SendOtpToEmailAsync(string userId);
        Task<ResponseDTO<object>> ChangePasswordAsync(string userId, ChangePasswordRequestDTO dto);

        Task<ResponseDTO<string>> ResetPasswordForUserAsync(ResetUserPasswordDTO dto);
    }
}

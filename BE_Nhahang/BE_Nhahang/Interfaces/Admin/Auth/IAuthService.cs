using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models.Jwt;

namespace BE_Nhahang.Interfaces.Admin.Auth
{
    public interface IAuthService
    {
        Task<ResponseDTO<object>> LoginAsync(LoginModel model);
        Task<ResponseDTO<object>> RegisterAsync(Registers model);

        // api mỡ khóa tài khoản 
        Task<ResponseDTO<object>> UnlockAccountAsync(string username);
        // api khóa tài khoản 
        Task<ResponseDTO<string>> DisableAccountAsync(string username);

        ResponseDTO<object> VerifyToken(string token);
    }
}


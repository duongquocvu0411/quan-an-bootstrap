using BE_Mentoring;
using BE_Mentoring.Services;

using BE_Nhahang.Interfaces.Admin.AdminId;
using System.Security.Claims;

namespace BE_Nhahang.Interfaces.Admin.AdminId
{
    public interface IHttpContextAccessorService
    {
        string? GetAdminId();
        string? GetAdminRole();
        string? GetClientIpAddress();
        string? GetUserAgent();
        string? GetAdminInfo();
        string? GetNameAdmin();
        Task<string?> GetMostAccuratePublicIpAsync();
    }
}

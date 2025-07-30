using BE_Nhahang.DTOS.Jwt;
using BE_Nhahang.DTOS.Response;
using Microsoft.AspNetCore.Identity;

namespace BE_Nhahang.Interfaces.Jwt
{
    public interface IRoleService
    {
        Task<ResponseDTO<IEnumerable<IdentityRole>>> GetAllAsync();
        Task<ResponseDTO<IdentityRole>> GetByIdAsync(string id);
        Task<ResponseDTO<string>> CreateAsync(RoleDTO dto);
        Task<ResponseDTO<string>> UpdateAsync(string id, RoleDTO dto);
        Task<ResponseDTO<string>> DeleteAsync(string id);
    }
}

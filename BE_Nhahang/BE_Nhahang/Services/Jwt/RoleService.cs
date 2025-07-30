using BE_Nhahang.DTOS.Jwt;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Jwt;
using Microsoft.AspNetCore.Identity;

namespace BE_Nhahang.Services.Jwt
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleService(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<ResponseDTO<IEnumerable<IdentityRole>>> GetAllAsync()
        {
            var roles = _roleManager.Roles.ToList();
            return new ResponseDTO<IEnumerable<IdentityRole>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Get all roles successful!",
                Data = roles
            };
        }

        public async Task<ResponseDTO<IdentityRole>> GetByIdAsync(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return new ResponseDTO<IdentityRole> { IsSuccess = false, code = 404, Message = "Role not found" };

            return new ResponseDTO<IdentityRole>
            {
                IsSuccess = true,
                code = 200,
                Message = "Get role successful!",
                Data = role
            };
        }

        public async Task<ResponseDTO<string>> CreateAsync(RoleDTO dto)
        {
            if (await _roleManager.RoleExistsAsync(dto.Name))
            {
                return new ResponseDTO<string>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Role already exists!"
                };
            }

            var result = await _roleManager.CreateAsync(new IdentityRole(dto.Name));
            return new ResponseDTO<string>
            {
                IsSuccess = result.Succeeded,
                code = result.Succeeded ? 201 : 500,
                Message = result.Succeeded ? "Role created successfully!" : "Role creation failed!",
            };
        }

        public async Task<ResponseDTO<string>> UpdateAsync(string id, RoleDTO dto)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return new ResponseDTO<string> { IsSuccess = false, code = 404, Message = "Role not found" };

            if (await _roleManager.RoleExistsAsync(dto.Name) && !string.Equals(role.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
            {
                return new ResponseDTO<string> { IsSuccess = false, code = 400, Message = "Role name already exists!" };
            }

            role.Name = dto.Name;
            var result = await _roleManager.UpdateAsync(role);

            return new ResponseDTO<string>
            {
                IsSuccess = result.Succeeded,
                code = result.Succeeded ? 200 : 500,
                Message = result.Succeeded ? "Role updated successfully!" : "Update failed"
            };
        }

        public async Task<ResponseDTO<string>> DeleteAsync(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return new ResponseDTO<string> { IsSuccess = false, code = 404, Message = "Role not found" };

            var result = await _roleManager.DeleteAsync(role);
            return new ResponseDTO<string>
            {
                IsSuccess = result.Succeeded,
                code = result.Succeeded ? 200 : 500,
                Message = result.Succeeded ? "Role deleted successfully!" : "Delete failed"
            };
        }
    }
}

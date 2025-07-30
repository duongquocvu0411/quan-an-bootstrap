using BE_Nhahang.DTOS.Jwt;
using BE_Nhahang.Interfaces.Jwt;
using BE_Nhahang.Models.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Jwt
{
    [Route("admin/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        [Authorize(Roles =UserRoles.Admin)]
        public async Task<IActionResult> GetAll() => Ok(await _roleService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id) => Ok(await _roleService.GetByIdAsync(id));

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] RoleDTO dto) => Ok(await _roleService.CreateAsync(dto));

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] RoleDTO dto) => Ok(await _roleService.UpdateAsync(id, dto));

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id) => Ok(await _roleService.DeleteAsync(id));
    }
}
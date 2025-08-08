using BE_Nhahang.DTOS.Admin.About;
using BE_Nhahang.Interfaces.Admin.About;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.About
{
    [ApiController]
    [Route("about")]
    public class AboutController : ControllerBase
    {
        private readonly IAboutService _service;

        public AboutController(IAboutService aboutService)
        {
            _service = aboutService;
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool? isActive = null)
        {
            var result = await _service.GetPagedAboutsAsync(page, pageSize, isActive);
            return StatusCode(result.code, result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.code, result);
        }

        [HttpGet("client")]
        public async Task<IActionResult> GetAllActive()
        {
            var result = await _service.GetAllActiveAsync();
            return StatusCode(result.code, result);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Create([FromForm] AboutDTO dto)
        {
            var result = await _service.CreateAboutAsync(dto);
            return StatusCode(result.code, result);
        }

        [HttpPut("update")  ]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Update([FromQuery] int id, [FromForm] AboutDTO dto)
        {
            var result = await _service.UpdateAboutAsync(id, dto);
            return StatusCode(result.code, result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete( List<int> ids)
        {
            var result = await _service.DeleteAsync(ids);
            return StatusCode(result.code, result);
        }
    }
}

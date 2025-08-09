using BE_Nhahang.Interfaces.Admin.Chefs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BE_Nhahang.DTOS.Admin.Chefs.ChefsDTO;

namespace BE_Nhahang.Controllers.Admin.Chefs
{
    [Route("chefs")]
    [ApiController]
    public class ChefsController : ControllerBase
    {
        private readonly IChefsService _chefsService;

        public ChefsController(IChefsService chefsService)
        {
            _chefsService = chefsService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll(
      [FromQuery] int pageNumber = 1,
      [FromQuery] int pageSize = 10,
      [FromQuery] bool isActive = true)
        {
            var result = await _chefsService.GetAllAsync(pageNumber, pageSize, isActive);
            return StatusCode(result.code, result);
        }



        [HttpGet("client")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _chefsService.GetAllClientAsync();
            return StatusCode(result.code, result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _chefsService.GetByIdAsync(id);
            return StatusCode(result.code, result);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Create([FromForm] ChefsCreateDTO dto)
        {
            var result = await _chefsService.CreateAsync(dto);
            return StatusCode(result.code, result);
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Update([FromForm] ChefsUpdateDTO dto)
        {
            var result = await _chefsService.UpdateAsync(dto);
            return StatusCode(result.code, result);
        }

        [HttpDelete("delete")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Delete( List<int> ids)
        {
            var result = await _chefsService.DeleteAsync(ids);
            return StatusCode(result.code, result);
        }
    }
}

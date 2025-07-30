using BE_Nhahang.DTOS.Admin.CategoryFood;
using BE_Nhahang.Interfaces.Admin.FoodCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.FoodCategory
{
    [Route("admin/food-category")]
    [ApiController]

    public class FoodCategoryController : ControllerBase
    {
        private readonly IFoodCategoryService _service;

        public FoodCategoryController(IFoodCategoryService service)
        {
            _service = service;
        }


        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FoodCategoryDTO dto)
        {
            var result = await _service.CreateAsync(dto);
            return StatusCode(result.code, result);
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FoodCategoryDTO dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return StatusCode(result.code, result);
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return StatusCode(result.code, result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("paging")]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetPagedAsync(page, pageSize);
            return StatusCode(result.code, result);
        }


        [HttpGet("category-foods/{id}")]
        public async Task<IActionResult> GetFoodsByCategory(int id, int page = 1, int pageSize = 2)
        {
            var result = await _service.GetByIdAsync(id, page, pageSize);
            return StatusCode(result.code, result);
        }
    }
}

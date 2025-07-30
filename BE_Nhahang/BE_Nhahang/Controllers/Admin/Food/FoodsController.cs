using BE_Nhahang.DTOS.Admin.FoodDTO;
using BE_Nhahang.DTOS.Common;
using BE_Nhahang.Interfaces.Admin.Food;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Food
{
    [ApiController]
    public class FoodsController : ControllerBase
    {
        private readonly IFoodService _foodService;

        public FoodsController(IFoodService foodService)
        {
            _foodService = foodService;
        }

        /// <summary>
        /// Api lấy danh sách món ăn với phân trang
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("list-food")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _foodService.GetPagedFoodsAsync(page, pageSize);
            return StatusCode(result.code, result);
        }

        /// <summary>
        /// Api tìm kiếm món ăn theo các tiêu chí
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpPost("search")]
        public async Task<IActionResult> SearchFoods([FromBody] SearchFilterDTO filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _foodService.SearchFoodsAsync(filter, page, pageSize);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Api lấy chi tiết món ăn theo ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("food-detail/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _foodService.GetFoodByIdAsync(id);
            return StatusCode(result.code, result);
        }


        /// <summary>
        ///  Api tạo mới món ăn
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("create-food")]
        public async Task<IActionResult> Create([FromForm] FoodDTO dto)
        {
            var result = await _foodService.CreateFoodAsync(dto);
            return StatusCode(result.code, result);
        }


        /// <summary>
        ///  Api cập nhật món ăn theo ID
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,Manager")]
        [HttpPut("update-food/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] FoodDTO dto)
        {
            var result = await _foodService.UpdateFoodAsync(id, dto);
            return StatusCode(result.code, result);
        }


        /// <summary>
        ///  Api Xóa món ăn theo ID
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "Admin,Manager")]
        [HttpDelete("delete-food")]
        public async Task<IActionResult> Delete(DeleteIds id)
        {
            var result = await _foodService.DeleteFoodAsync(id);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Api xóa nhiều hình ảnh theo danh sách ID
        /// </summary>
        /// <param name="imageIds"></param>
        /// <returns></returns>
        [HttpDelete("batch")]
        public async Task<IActionResult> DeleteImages([FromBody] List<int> imageIds)
        {
            var result = await _foodService.DeleteImagesAsync(imageIds);
            return StatusCode(result.code, result);
        }
    }
}

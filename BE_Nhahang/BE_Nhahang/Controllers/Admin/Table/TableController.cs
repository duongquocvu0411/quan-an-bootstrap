using BE_Nhahang.DTOS.Admin.Tables;
using BE_Nhahang.Interfaces.Admin.Table;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Table
{
    [ApiController]
    [Route("/table")]
    public class TableController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TableController(ITableService tableService)
        {
            _tableService = tableService;
        }

        /// <summary>
        /// Api xem danh sách bàn 
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="isDeleted"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool? isDeleted = null)
        {
            var result = await _tableService.GetAllTablesAsync(page, pageSize, isDeleted);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Api xem chi tiết bàn admin 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id, int page = 1, int pageSize = 10)
        {
            var result = await _tableService.GetTableDetailAsync(id, page, pageSize);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Lấy chi tiết bàn ăn (Client) – chỉ gồm thông tin bàn & ảnh
        /// </summary>
        [HttpGet("{id}/client-detail")]
        public async Task<IActionResult> GetClientDetail(int id)
        {
            var result = await _tableService.GetTableDetailForClientAsync(id);
            return StatusCode(result.code, result);
        }


        [HttpGet("booking/{bookingId}/orders")]
        public async Task<IActionResult> GetBookingOrderDetail(int bookingId, int page = 1, int pageSize = 10)
        {
            var result = await _tableService.GetBookingOrderDetailAsync(bookingId, page, pageSize);
            return StatusCode(result.code, result);
        }




        /// <summary>
        /// Api tao bàn mới
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost("create")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Create([FromForm] TableDTO dto)
        {
            var result = await _tableService.CreateTableAsync(dto);
            return StatusCode(result.code, result);
        }


        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Update(int id, [FromForm] TableDTO dto)
        {
            var result = await _tableService.UpdateTableAsync(id, dto);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Api xóa mềm bàn ăn 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPatch("soft-delete/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _tableService.SoftDeleteTableAsync(id);
            return StatusCode(result.code, result);
        }


        /// <summary>
        /// Api khôi phục xóa bàn ăn 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPatch("restore/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _tableService.RestoreTableAsync(id);
            return StatusCode(result.code, result);
        }

        /// <summary>
        /// Api xóa vĩnh viền
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _tableService.DeleteTablePermanentlyAsync(id);
            return StatusCode(result.code, result);
        }

    }
}

using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.Table.Booking.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Table.Order
{
    [ApiController]
    [Route("/table-order")]
    public class TableOrderController : ControllerBase
    {
        private readonly ITableOrderService _orderService;

        public TableOrderController(ITableOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> AddMultipleOrders([FromBody] AddOrderByFoodIdRequestDTO request)
        {
            var response = await _orderService.AddOrdersByFoodIdAsync(request);
            return StatusCode(response.code, response);
        }

        [HttpPut("update-status")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateTableOrderStatusDTO dto)
        {
            var response = await _orderService.UpdateOrderStatusAsync(dto);

            if (!response.IsSuccess)
            {
                return StatusCode(response.code, response);
            }

            return Ok(response);
        }

        [HttpDelete("delete-multiple")]
        [Authorize]
        public async Task<IActionResult> DeleteMultipleOrders([FromBody] DeleteOrdersDTO deleteOrdersDTO)
        {
            try
            {
                var response = await _orderService.DeleteMultipleOrdersAsync(deleteOrdersDTO);

                if (response.IsSuccess)
                {
                    return Ok(response); // Trả về ResponseDTO khi thành công
                }

                return BadRequest(response); // Trả về ResponseDTO khi có lỗi
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<string>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Đã có lỗi xảy ra: " + ex.Message
                });
            }
        }
    }
}

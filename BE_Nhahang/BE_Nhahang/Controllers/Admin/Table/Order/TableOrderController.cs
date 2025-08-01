using BE_Nhahang.DTOS.Admin.Tables.Booking;
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
    }
}

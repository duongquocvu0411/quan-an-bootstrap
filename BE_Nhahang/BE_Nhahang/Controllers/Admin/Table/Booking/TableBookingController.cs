using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.Table.Booking.CreateBooking;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Table;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Table.Booking
{
    [ApiController]
    [Route("table-booking")]
    public class TableBookingController : ControllerBase
    {
        private readonly ITableBookingService _bookingService;

        public TableBookingController(ITableBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet("list")]
     
        public async Task<ActionResult<ResponseDTO<PagedResult<TableBookingModel>>>> GetAll(
       [FromQuery] int page = 1,
       [FromQuery] int pageSize = 10)
        {
            var res = await _bookingService.GetAllAsync(page, pageSize);
            return StatusCode(res.code, res); // trả đúng mã code trong ResponseDTO
        }




        [HttpPost("look-up")]
        public async Task<ActionResult<ResponseDTO<object>>> Lookup(BookingLookupFilterDTO fullter)
        {
            var result = await _bookingService.LookupAsync(fullter);
            return StatusCode(result.code, result);
        }

        [HttpPost("create")]
        public async Task<ActionResult<ResponseDTO<object>>> CreateBooking([FromBody] TableBookingDTO dto)
        {
            var result = await _bookingService.CreateBookingAsync(dto);
            return StatusCode(result.code, result);
        }

        [HttpPut("update-status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ResponseDTO<object>>> UpdateStatus([FromBody] UpdateBookingStatusDTO dto)
        {
            var result = await _bookingService.UpdateStatusAsync(dto);
            return StatusCode(result.code, result);
        }


        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ResponseDTO<object>>> Delete(int id)
        {
            var result = await _bookingService.DeleteAsync(id);
            return StatusCode(result.code, result);
        }
    }
}
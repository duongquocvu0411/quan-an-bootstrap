using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.Interfaces.Admin.Table.Booking;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Table.Booking
{
    [Route("table-suggestion")]
    [ApiController]
    public class TableSuggestionController : ControllerBase
    {
        private readonly ITableSuggestionService _tableSuggestionService;

        public TableSuggestionController(ITableSuggestionService tableSuggestionService)
        {
            _tableSuggestionService = tableSuggestionService;
        }

        [HttpPost]
        public async Task<IActionResult> SuggestTables(
         [FromBody] SuggestTableDTO dto,
         [FromQuery] int pageNumber = 1,
         [FromQuery] int pageSize = 10)
        {
            var result = await _tableSuggestionService.SuggestTablesAsync(dto, pageNumber, pageSize);
            return StatusCode(result.code, result);
        }

    }
}

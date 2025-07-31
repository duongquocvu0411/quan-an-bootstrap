using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Table;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking
{
    public interface ITableSuggestionService
    {
        Task<ResponseDTO<PagedResult<TableModel>>> SuggestTablesAsync(SuggestTableDTO dto, int pageNumber, int pageSize);

    }
}

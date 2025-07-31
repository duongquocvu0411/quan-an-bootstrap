using BE_Nhahang.DTOS.Admin.Tables;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;

namespace BE_Nhahang.Interfaces.Admin.Table
{
    public interface ITableService
    {
        Task<ResponseDTO<PagedResult<object>>> GetAllTablesAsync(int page, int pageSize, bool? isDeleted);
        Task<ResponseDTO<object>> GetTableDetailAsync(int id, int page, int pageSize);

        Task<ResponseDTO<object>> GetTableDetailForClientAsync(int id);

        Task<ResponseDTO<object>> GetBookingOrderDetailAsync(int bookingId, int page, int pageSize);


        Task<ResponseDTO<object>> CreateTableAsync(TableDTO dto);
        Task<ResponseDTO<object>> UpdateTableAsync(int id, TableDTO dto);


        Task<ResponseDTO<object>> SoftDeleteTableAsync(int id);
        Task<ResponseDTO<object>> RestoreTableAsync(int id);
        Task<ResponseDTO<object>> DeleteTablePermanentlyAsync(int id);

    }
}

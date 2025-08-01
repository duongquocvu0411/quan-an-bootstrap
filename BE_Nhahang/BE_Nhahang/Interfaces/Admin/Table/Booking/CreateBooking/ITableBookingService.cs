using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Table;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking.CreateBooking
{
    public interface ITableBookingService
    {
        Task<ResponseDTO<PagedResult<TableBookingModel>>> GetAllAsync(int page, int pageSize);

        Task<ResponseDTO<object>> LookupAsync(BookingLookupFilterDTO fillter);
        Task<ResponseDTO<object>> CreateBookingAsync(TableBookingDTO dto);
        Task<ResponseDTO<object>> UpdateStatusAsync(UpdateBookingStatusDTO dto);

        Task<ResponseDTO<object>> DeleteAsync(int bookingId);

    }
}

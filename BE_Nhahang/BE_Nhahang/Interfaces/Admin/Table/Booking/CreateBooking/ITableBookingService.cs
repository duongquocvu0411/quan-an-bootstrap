using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking.CreateBooking
{
    public interface ITableBookingService
    {
        Task<ResponseDTO<object>> LookupAsync(BookingLookupFilterDTO fillter);
        Task<ResponseDTO<object>> CreateBookingAsync(TableBookingDTO dto);
        Task<ResponseDTO<object>> UpdateStatusAsync(UpdateBookingStatusDTO dto);

        Task<ResponseDTO<object>> DeleteAsync(int bookingId);

    }
}

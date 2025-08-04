using BE_Nhahang.DTOS.Admin.Payment;
using BE_Nhahang.DTOS.Response;

namespace BE_Nhahang.Interfaces.Admin.Payment
{
    public interface IPaymentQrService
    {
        //Task<ResponseDTO<VietQrResponseDTO>> CreateBookingPaymentQrAsync(int bookingId );
        Task<ResponseDTO<VietQrResponseDTO>> CreateBookingPaymentQrAsync(int bookingId, int bankAccountId);
    }
}

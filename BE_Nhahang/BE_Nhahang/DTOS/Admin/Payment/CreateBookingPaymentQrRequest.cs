namespace BE_Nhahang.DTOS.Admin.Payment
{
    public class CreateBookingPaymentQrRequest
    {
        public int BookingId { get; set; }
    }

    public class VietQrResponseDTO
    {
        public string QrImageUrl { get; set; } = default!;
        public string FinalNote { get; set; } = default!;
    }
}

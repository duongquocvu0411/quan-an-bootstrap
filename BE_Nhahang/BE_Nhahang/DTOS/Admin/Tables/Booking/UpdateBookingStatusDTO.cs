namespace BE_Nhahang.DTOS.Admin.Tables.Booking
{
    public class UpdateBookingStatusDTO
    {
        public int BookingId { get; set; }
        public string NewStatus { get; set; } = string.Empty;
    }
}

namespace BE_Nhahang.DTOS.Admin.Tables.Booking
{
    public class BookingLookupFilterDTO
    {
        public string? BookingCode { get; set; }
        public int? TableId { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerName { get; set; }
    }
}

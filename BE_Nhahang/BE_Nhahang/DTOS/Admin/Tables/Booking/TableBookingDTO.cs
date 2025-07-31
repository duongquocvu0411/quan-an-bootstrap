namespace BE_Nhahang.DTOS.Admin.Tables.Booking
{
    public class TableBookingDTO
    {
        public int TableId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public DateTime BookingTime { get; set; }
        public int GuestCount { get; set; }
        public string? Note { get; set; }
    }
}

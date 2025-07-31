namespace BE_Nhahang.Helpers.Booking
{
    public static class BookingStatusHelper
    {
        public static bool CanUpdate(string currentStatus)
        {
            return currentStatus != "Canceled" && currentStatus != "Completed";
        }

        public static string? GetUpdatedTableStatus(string newBookingStatus)
        {
            return newBookingStatus switch
            {
                "CheckedIn" => "Occupied",
                "Canceled" or "Completed" => "Available",
                _ => null
            };
        }
    }
}

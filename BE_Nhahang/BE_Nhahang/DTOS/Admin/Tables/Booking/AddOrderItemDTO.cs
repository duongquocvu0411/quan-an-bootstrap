namespace BE_Nhahang.DTOS.Admin.Tables.Booking
{
    public class AddOrderItemDTO
    {
        public int FoodId { get; set; }

        public int Quantity { get; set; }
        public string? note { get; set; }
   }

    public class AddOrderByFoodIdRequestDTO
    {
        public int BookingId { get; set; }

        public List<AddOrderItemDTO> Items  { get; set; }
    }
}

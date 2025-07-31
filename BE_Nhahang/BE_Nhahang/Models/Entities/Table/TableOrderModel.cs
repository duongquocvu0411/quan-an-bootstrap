using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities.Table
{
    public class TableOrderModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Booking")]
        public int BookingId { get; set; }

        public TableBookingModel? Booking { get; set; }

        [Required]
        public string FoodName { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal PriceAtOrder { get; set; }

        public string? Note { get; set; }

        public string Status { get; set; } = "Ordered"; // Ordered, Cooking, Served, Canceled

    }
}

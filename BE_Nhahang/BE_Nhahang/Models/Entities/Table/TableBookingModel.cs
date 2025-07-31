using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities.Table
{
    public class TableBookingModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Table")]
        public int TableId { get; set; }

        public TableModel? Table { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        [Phone,MaxLength(20)]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        public DateTime BookingTime { get; set; }

        public int GuestCount { get; set; }

        [Required]
        public string Status { get; set; } = "Booked"; // Booked, CheckedIn, Completed, Canceled

        public string? Note { get; set; }

        // Navigation: danh sách món ăn được order theo bàn
        public ICollection<TableOrderModel>? TableOrders { get; set; }
    }
}

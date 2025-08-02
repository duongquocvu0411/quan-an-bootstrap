using BE_Nhahang.Models.Entities.Table;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities.Payment
{
    public class PaymentQrModel
    {
        [Key]
        public int Id { get; set; }

        // Khóa ngoại tới Booking
        [Required]
        public int BookingId { get; set; }

        [ForeignKey(nameof(BookingId))]
        public TableBookingModel Booking { get; set; } = default!;

        // Số tiền thanh toán
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        // Nội dung (ghi chú/addInfo)
        [MaxLength(256)]
        public string Note { get; set; } = string.Empty;

        // Hình ảnh QR (URL)
        [Required]
        [MaxLength(512)]
        public string QrImageUrl { get; set; } = string.Empty;

        // Audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(64)]
        public string? CreatedBy { get; set; }
    }
}

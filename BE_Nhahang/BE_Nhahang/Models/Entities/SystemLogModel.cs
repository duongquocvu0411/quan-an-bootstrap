using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities
{
    public class SystemLogModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(450)]
        public string UserId { get; set; } // Người thực hiện (FK đến IdentityUser)

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } // Create / Update / Delete / Login / ResetPassword...

        [Required]
        [MaxLength(100)]
        public string? EntityName { get; set; } // Tên bảng/thực thể: FoodCategory, Reservation...

        [MaxLength(100)]
        public string? EntityId { get; set; } // Id của đối tượng bị thao tác (ví dụ: Id = 12)

        [MaxLength(1000)]
        public string? Message { get; set; } // Mô tả hành động, có thể ghi trạng thái chi tiết

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

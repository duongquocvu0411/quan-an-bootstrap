using BE_Nhahang;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities;
using BE_Nhahang.Models.Entities.Table;
using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities.Table
{
    public class TableModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string TableNumber { get; set; } = string.Empty;

        [Required]
        public int Capacity { get; set; }

        [Required]
        public string Status { get; set; } = "Available"; // Available, Reserved, Occupied

        
        public string? Location { get; set; }
        
        public bool isDeleted { get; set; } = false; // Trạng thái xóa mềm

        // Navigation: danh sách ảnh của bàn
        public ICollection<TableImageModel>? TableImages { get; set; }

        // Navigation: danh sách lịch sử đặt bàn
        public ICollection<TableBookingModel>? Bookings { get; set; }

    }
}

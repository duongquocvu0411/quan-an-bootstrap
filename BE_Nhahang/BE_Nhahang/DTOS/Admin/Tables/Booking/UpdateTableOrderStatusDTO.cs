using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Tables.Booking
{
    public class UpdateTableOrderStatusDTO
    {
        [Required]
        public int Id { get; set; }  // Mã của món ăn cần cập nhật
        [Required]
        public string Status { get; set; }  // Trạng thái mới ("Ordered", "Cooking", "Served", "Canceled")
    }
}

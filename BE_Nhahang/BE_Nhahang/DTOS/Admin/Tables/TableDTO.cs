namespace BE_Nhahang.DTOS.Admin.Tables
{
    public class TableDTO
    {
        public string TableNumber { get; set; } = "";   // Số hiệu bàn (B01, B02...)
        public int Capacity { get; set; }               // Sức chứa bàn
        public string Status { get; set; } = "Available"; // Trạng thái bàn
        public string? Location { get; set; }           // Vị trí (nếu có)
        // Có thể thêm: danh sách ảnh nếu muốn trả về kèm
        public List<IFormFile>? Images { get; set; }
    }
}

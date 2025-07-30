using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models
{
    public class BaseModels
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [MaxLength(450)]
        public string CreatedBy { get; set; } 
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        [MaxLength(450)]
        public string? UpdatedBy { get; set; }   
    }
}

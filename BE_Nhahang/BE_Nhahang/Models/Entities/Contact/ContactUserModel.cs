using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities.Contact
{
    public class ContactUserModel
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(255)]
        public string YourName { get; set; }

        [Required]
        [EmailAddress,MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [Phone,MaxLength(20)]
        public string Phone { get; set; }

        [Required]
        [MaxLength(255)]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsReplied { get; set; } = false;

        public string? RepliedBy { get; set; } // Ai phản hồi
        public DateTime? RepliedAt { get; set; } // Thời điểm phản hồi

        [InverseProperty("ContactUser")]
        public ContactUserReplyModel? ContactUserReply { get; set; }
    }
}

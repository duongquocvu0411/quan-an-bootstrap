using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Contact
{
    public class ContactUserDTO
    {
        [Required]
        [MaxLength(255)]
        public string YourName { get; set; }

        [Required]
        [EmailAddress, MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [Phone, MaxLength(20)]
        public string Phone { get; set; }

        [Required]
        [MaxLength(255)]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }
    }
}

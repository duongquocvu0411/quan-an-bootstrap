using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Contact
{
    public class ContactAdminDTO
    {
        
        [Required]
        public string Location { get; set; }

        [Required]
        [Phone, MaxLength(20)]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(100), EmailAddress]
        public string EmailAddress { get; set; }

        [Required]
        public string OpenHours { get; set; }

        [Required]
        public string Mapurl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}

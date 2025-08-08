using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities.Contact
{
    public class ContactAdminModel : BaseModels
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Location { get; set; }

        [Required]
        [Phone,MaxLength(20)]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(100), EmailAddress]
        public string EmailAddress { get; set; }

        [Required]
        public string OpenHours { get; set; }

        [Required]
        [Url]
        public string Mapurl { get; set; }
        public bool IsActive  { get; set; } = true;

    }
}

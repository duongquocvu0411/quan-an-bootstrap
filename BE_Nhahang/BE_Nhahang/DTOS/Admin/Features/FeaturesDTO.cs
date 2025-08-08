using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Features
{
    public class FeaturesDTO
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public IFormFile ImageFile { get; set; }

        public string Link { get; set; }

        [Required]
        public int DisplayOrder { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}

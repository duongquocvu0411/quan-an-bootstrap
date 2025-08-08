using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities.About
{
    public class FeaturesModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public string image {  get; set; }

        public string link { get; set; }

        public int DisplayOrder { get; set; }

        public bool isActive { get; set; }
    }
}

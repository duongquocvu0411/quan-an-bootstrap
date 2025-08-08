using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities.About
{
    public class AboutModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Descriptions { get; set; }

        [Required]  
        public  bool IsActive { get; set; }

        public int DisplayOrder {  get; set; }

        public ICollection<AboutImageModel> Images { get; set; } = new List<AboutImageModel>();
    }
}


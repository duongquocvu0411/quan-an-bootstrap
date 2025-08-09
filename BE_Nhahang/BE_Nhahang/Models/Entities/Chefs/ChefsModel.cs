using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities.Chefs
{
    public class ChefsModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Role {  get; set; }

        [Required]
        public int DisplayOrder { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; }

        public string? TwitterLink { get; set; }

        public string? FacebookLink { get; set; }

        public string? instagramLink { get; set; }

        public string? LinkedinLink { get; set; }

        public bool IsActive { get; set; } = true;

    }
}

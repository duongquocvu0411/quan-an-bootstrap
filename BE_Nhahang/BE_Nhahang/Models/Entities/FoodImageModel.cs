using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities
{
    public class FoodImageModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int FoodId { get; set; }

        [ForeignKey("FoodId")]
        public FoodModel Food { get; set; }

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; }

    }
}

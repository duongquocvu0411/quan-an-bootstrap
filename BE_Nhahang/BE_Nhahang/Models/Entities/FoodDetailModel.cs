using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities
{
    public class FoodDetailModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int FoodId { get; set; }

        [ForeignKey("FoodId")]
        public FoodModel Food { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? Ingredients { get; set; }

        [MaxLength(500)]
        public string? CookingMethod { get; set; }

        public int? Calories { get; set; }

        public int? PreparationTimeMinutes { get; set; }
    }
}

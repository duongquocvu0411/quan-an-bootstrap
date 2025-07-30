using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.CategoryFood
{
    public class FoodCategoryDTO
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
    }
}

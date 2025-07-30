using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities
{
    public class FoodCategoryModel : BaseModels
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(255)]
        public string Name { get; set; }
    }
}

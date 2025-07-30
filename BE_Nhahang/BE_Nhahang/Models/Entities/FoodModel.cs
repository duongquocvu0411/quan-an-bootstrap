using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities
{
    public class FoodModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        //  Khóa ngoại đến bảng FoodCategory
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(255)]
        public string ImageUrl { get; set; }

        [ForeignKey("CategoryId")]
        public FoodCategoryModel Category { get; set; }

        // mối quan hệ 1-1 
        public FoodDetailModel? FoodDetail { get; set; }

        // mối quan hệ 1-n
        public ICollection<FoodImageModel>? FoodImages { get; set; }
    }
}

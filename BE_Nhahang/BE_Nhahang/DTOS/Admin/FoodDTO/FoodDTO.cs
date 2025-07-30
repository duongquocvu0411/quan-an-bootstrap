namespace BE_Nhahang.DTOS.Admin.FoodDTO
{
    public class FoodDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public IFormFile ImageUrl { get; set; }

        // chi tiết món ăn
        public string? DetailDescription { get; set; }
        public string? Ingredients { get; set; }
        public string? CookingMethod { get; set; }
        public int? Calories { get; set; }
        public int? PreparationTimeMinutes { get; set; }

        public List<IFormFile>? AdditionalImages { get; set; }

    }

    public class DeleteIds
    {
        public List<int> Ids
        {
            get; set;
        }
    }
}

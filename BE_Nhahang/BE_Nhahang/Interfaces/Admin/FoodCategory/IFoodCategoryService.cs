using BE_Nhahang.DTOS.Admin.CategoryFood;
using BE_Nhahang.DTOS.Response;

namespace BE_Nhahang.Interfaces.Admin.FoodCategory
{
    public interface IFoodCategoryService
    {
        Task<ResponseDTO<object>> CreateAsync(FoodCategoryDTO dto);
        Task<ResponseDTO<object>> UpdateAsync(int id, FoodCategoryDTO dto);
        Task<ResponseDTO<object>> DeleteAsync(int id);
        Task<ResponseDTO<object>> GetAllAsync();
        Task<ResponseDTO<object>> GetPagedAsync(int page, int pageSize);

        Task<ResponseDTO<object>> GetByIdAsync(int id, int page, int pagesize);
    }
}

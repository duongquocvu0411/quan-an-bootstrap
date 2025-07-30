using BE_Nhahang.DTOS.Admin.FoodDTO;
using BE_Nhahang.DTOS.Common;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities;

namespace BE_Nhahang.Interfaces.Admin.Food
{
    public interface IFoodService
    {
        Task<ResponseDTO<PagedResult<object>>> GetPagedFoodsAsync(int page, int pageSize);
        Task<ResponseDTO<object>> GetFoodByIdAsync(int id);
        Task<ResponseDTO<object>> CreateFoodAsync(FoodDTO dto);
        Task<ResponseDTO<object>> UpdateFoodAsync(int id, FoodDTO dto);
        Task<ResponseDTO<string>> DeleteFoodAsync(DeleteIds id);
        Task<ResponseDTO<object>> DeleteImagesAsync(List<int> imageIds);

        Task<ResponseDTO<PagedResult<FoodModel>>> SearchFoodsAsync(SearchFilterDTO filter, int page, int pageSize);
    }
}

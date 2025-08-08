using BE_Nhahang.DTOS.Admin.Features;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;

namespace BE_Nhahang.Interfaces.Admin.Feature
{
    public interface IFeatureService
    {
        Task<ResponseDTO<PagedResult<object>>> GetPagedAsync(int page, int pageSize, bool isactive = true);
        Task<ResponseDTO<object>> GetActiveFeaturesAsync();
        Task<ResponseDTO<object>> GetByIdAsync(int id);
        Task<ResponseDTO<object>> CreateAsync(FeaturesDTO dto);
        Task<ResponseDTO<object>> UpdateAsync(int id, FeaturesDTO dto);
        Task<ResponseDTO<object>> DeleteMultipleAsync(List<int> ids);
    }
}

using BE_Nhahang.DTOS.Admin.About;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.About;

namespace BE_Nhahang.Interfaces.Admin.About
{
    public interface IAboutService
    {
        Task<ResponseDTO<PagedResult<object>>> GetPagedAboutsAsync(int page, int pageSize, bool? isActive);
        Task<ResponseDTO<object>> GetByIdAsync(int id);
        Task<ResponseDTO<IEnumerable<object>>> GetAllActiveAsync();
        Task<ResponseDTO<object>> CreateAboutAsync(AboutDTO dto);
        Task<ResponseDTO<object>> UpdateAboutAsync(int id, AboutDTO dto);
        Task<ResponseDTO<object>> DeleteAsync(List<int> ids);
    }
}

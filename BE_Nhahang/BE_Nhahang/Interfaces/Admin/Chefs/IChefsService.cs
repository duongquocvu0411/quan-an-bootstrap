using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Chefs;
using static BE_Nhahang.DTOS.Admin.Chefs.ChefsDTO;

namespace BE_Nhahang.Interfaces.Admin.Chefs
{
    public interface IChefsService
    {
        Task<ResponseDTO<PagedResult<ChefsModel>>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isActive = true);
        Task<ResponseDTO<object>> GetAllClientAsync();
        Task<ResponseDTO<object>> GetByIdAsync(int id);
        Task<ResponseDTO<object>> CreateAsync(ChefsCreateDTO dto);
        Task<ResponseDTO<object>> UpdateAsync(ChefsUpdateDTO dto);
        Task<ResponseDTO<object>> DeleteAsync(List<int> ids);
    }
}

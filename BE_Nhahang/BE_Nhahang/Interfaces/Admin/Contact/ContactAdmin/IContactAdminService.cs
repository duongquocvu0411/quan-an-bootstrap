using BE_Nhahang.DTOS.Admin.Contact;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Contact;

namespace BE_Nhahang.Interfaces.Admin.Contact.ContactAdmin
{
    public interface IContactAdminService
    {
        Task<ResponseDTO<PagedResult<ContactAdminModel>>> GetAllAsync(int page, int pageSize,bool isactive = true);
        Task<ResponseDTO<List<ContactAdminModel>>> GetAllActiveAsync();
        Task<ResponseDTO<ContactAdminModel>> GetByIdAsync(int id);
        Task<ResponseDTO<ContactAdminModel>> CreateAsync(ContactAdminDTO dto );
        Task<ResponseDTO<ContactAdminModel>> UpdateAsync(int id, ContactAdminDTO dto );
        Task<ResponseDTO<object>> DeleteAsync(List<int> ids);

    }
}

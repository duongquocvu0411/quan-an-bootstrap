using BE_Nhahang.DTOS.Admin.Contact;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Contact;

namespace BE_Nhahang.Interfaces.Admin.Contact
{
    public interface IContactUserService
    {
        
        Task<ResponseDTO<PagedResult<ContactUserModel>>> GetPagedAsync(int pageNumber, int pageSize, bool? isReplied = false);

        Task<ResponseDTO<ContactUserModel>> GetByIdAsync(int id);
        Task<ResponseDTO<object>> CreateAsync(ContactUserDTO dto);
        Task<ResponseDTO<object>> DeleteAsync(List<int> ids);
        Task<ResponseDTO<object>> ReplyToContactAsync(ContactUserReplyDTO dto);


    }
}

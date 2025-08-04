using BE_Nhahang.DTOS.Admin.Payment;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Payment;
using Org.BouncyCastle.Asn1.Ocsp;

namespace BE_Nhahang.Interfaces.Admin.Payment.Settings
{
    public interface IPaymentQrBankAccountService
    {
        Task<PagedResult<PaymentQrBankAccountModel>> GetAllAsync(int page, int pageSize, bool IsActive = true);
        Task<ResponseDTO<List<PaymentQrBankAccountModel>>> GetAllActiveAsync();
        Task<ResponseDTO<object>> GetByIdAsync(int id);
        Task<ResponseDTO<object>> CreateAsync(PaymentQrBankAccountDTO dto);
        Task<ResponseDTO<object>> UpdateAsync(int id, PaymentQrBankAccountDTO dto);
        Task<ResponseDTO<object>> DeleteAsync(List<int> ids);

    }
}

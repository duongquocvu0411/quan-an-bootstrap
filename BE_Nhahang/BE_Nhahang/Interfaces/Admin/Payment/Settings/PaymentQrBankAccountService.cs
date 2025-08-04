using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Payment;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Payment;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BE_Nhahang.Interfaces.Admin.Payment.Settings
{
    public class PaymentQrBankAccountService : IPaymentQrBankAccountService
    {
        private readonly DbConfig _context;
        private readonly IHttpContextAccessorService _contextAccessor;
        private readonly ISystemLogService _systemLogService;

        public PaymentQrBankAccountService(DbConfig context, ISystemLogService systemLogService, IHttpContextAccessorService contextAccessor)
        {
            _context = context;
            _systemLogService = systemLogService;
            _contextAccessor = contextAccessor;
        }

        public async Task<PagedResult<PaymentQrBankAccountModel>> GetAllAsync(int page, int pageSize, bool IsActive = true)
        {
            var query = _context.PaymentQrBankAccounts
                                .Where(x => x.IsActive == IsActive) 
                                .AsQueryable();

            var totalCount = await query.CountAsync();

            var results = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<PaymentQrBankAccountModel>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Results = results
            };
        }



        public async Task<ResponseDTO<List<PaymentQrBankAccountModel>>> GetAllActiveAsync()
        {
            var activeAccounts = await _context.PaymentQrBankAccounts
                .Where(x => x.IsActive)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return new ResponseDTO<List<PaymentQrBankAccountModel>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy danh sách tài khoản ngân hàng đang hoạt động thành công",
                Data = activeAccounts
            };
        }


        public async Task<ResponseDTO<object>> GetByIdAsync(int id)
        {
            var item = await _context.PaymentQrBankAccounts.FindAsync(id);
            if (item == null)
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy tài khoản." };

            return new ResponseDTO<object> { Data = item };
        }

        public async Task<ResponseDTO<object>> CreateAsync(PaymentQrBankAccountDTO dto)
        {
            // Kiểm tra trùng tài khoản (cùng BankBin và AccountNumber)
            var isDuplicate = await _context.PaymentQrBankAccounts
                .AnyAsync(x => x.BankBin == dto.BankBin && x.AccountNumber == dto.AccountNumber);

            if (isDuplicate)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Tài khoản ngân hàng đã tồn tại."
                };
            }

            // Gọi API VietQR để kiểm tra BankBin hợp lệ
            using var client = new HttpClient();
            var response = await client.GetAsync("https://api.vietqr.io/v2/banks");

            if (!response.IsSuccessStatusCode)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Không thể kiểm tra mã ngân hàng. Vui lòng thử lại sau."
                };
            }

            var content = await response.Content.ReadAsStringAsync();
            var bankData = JsonSerializer.Deserialize<VietQRBankResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var bankInfo = bankData?.Data?.FirstOrDefault(b => b.Bin == dto.BankBin);

            if (bankInfo == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Mã ngân hàng không hợp lệ."
                };
            }

            // Tạo mới
            var model = new PaymentQrBankAccountModel
            {
                BankBin = dto.BankBin,
                BankShortName = bankInfo.ShortName, //  Gán shortName vào cột mới
                AccountNumber = dto.AccountNumber,
                AccountName = dto.AccountName,
                IsActive = dto.IsActive,
                NotePrefix = dto.NotePrefix,
                EnableAmountLock = dto.EnableAmountLock,
                CreatedBy = _contextAccessor.GetAdminId()
            };

            _context.PaymentQrBankAccounts.Add(model);
            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Create", "PaymentQrBankAccount", model.Id.ToString(), $"Tạo tài khoản QR: {model.AccountNumber}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo tài khoản QR thành công.",
                Data = model.Id
            };
        }



        public async Task<ResponseDTO<object>> UpdateAsync(int id, PaymentQrBankAccountDTO dto)
        {
            var model = await _context.PaymentQrBankAccounts.FindAsync(id);
            if (model == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy tài khoản cần cập nhật."
                };
            }

            // Kiểm tra trùng tài khoản (BankBin + AccountNumber), loại trừ chính bản ghi đang cập nhật
            var isDuplicate = await _context.PaymentQrBankAccounts
                .AnyAsync(x => x.Id != id && x.BankBin == dto.BankBin && x.AccountNumber == dto.AccountNumber);

            if (isDuplicate)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Tài khoản ngân hàng đã tồn tại."
                };
            }

            // Gọi API VietQR để kiểm tra BankBin có hợp lệ không và lấy shortName
            using var client = new HttpClient();
            var response = await client.GetAsync("https://api.vietqr.io/v2/banks");

            if (!response.IsSuccessStatusCode)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Không thể kiểm tra mã ngân hàng. Vui lòng thử lại sau."
                };
            }

            var content = await response.Content.ReadAsStringAsync();
            var bankData = JsonSerializer.Deserialize<VietQRBankResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var matchedBank = bankData?.Data?.FirstOrDefault(b => b.Bin == dto.BankBin);

            if (matchedBank == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Mã ngân hàng không hợp lệ."
                };
            }

            // Cập nhật dữ liệu
            model.BankBin = dto.BankBin;
            model.AccountNumber = dto.AccountNumber;
            model.AccountName = dto.AccountName;
            model.IsActive = dto.IsActive;
            model.NotePrefix = dto.NotePrefix;
            model.EnableAmountLock = dto.EnableAmountLock;
            model.BankShortName = matchedBank.ShortName;
            model.UpdatedAt = DateTime.UtcNow;
            model.UpdatedBy = _contextAccessor.GetAdminId();

            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Update", "PaymentQrBankAccount", model.Id.ToString(), $"Cập nhật tài khoản QR: {model.AccountNumber}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Cập nhật tài khoản QR thành công.",
                Data = model.Id
            };
        }


        public async Task<ResponseDTO<object>> DeleteAsync(List<int> ids)
        {
            var accountsToDelete = await _context.PaymentQrBankAccounts
                .Where(x => ids.Contains(x.Id))
                .ToListAsync();

            if (accountsToDelete == null || accountsToDelete.Count == 0)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy tài khoản nào để xoá."
                };
            }

            var activeAccounts = await _context.PaymentQrBankAccounts
                .Where(x => x.IsActive)
                .ToListAsync();

            var activeAfterDelete = activeAccounts
                .Where(x => !accountsToDelete.Select(a => a.Id).Contains(x.Id))
                .ToList();

            if (activeAfterDelete.Count == 0)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Không thể xoá tất cả tài khoản đang hoạt động. Hệ thống cần ít nhất 1 tài khoản hoạt động."
                };
            }

            _context.PaymentQrBankAccounts.RemoveRange(accountsToDelete);
            await _context.SaveChangesAsync();

            foreach (var account in accountsToDelete)
            {
                await _systemLogService.LogAsync("Delete", "PaymentQrBankAccount", account.Id.ToString(), $"Xoá tài khoản QR: {account.AccountNumber}");
            }

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Đã xoá thành công {accountsToDelete.Count} tài khoản."
            };
        }

    }
}
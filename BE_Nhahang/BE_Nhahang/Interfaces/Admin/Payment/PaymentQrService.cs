using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Payment;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Models.Entities.Payment;
using BE_Nhahang.Models.Options;
using BE_Nhahang.Test.Option;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Web;

namespace BE_Nhahang.Interfaces.Admin.Payment
{
    public class PaymentQrService : IPaymentQrService
    {
        private readonly DbConfig _context;
        private readonly QrOptions _opt; 
        private readonly IHttpContextAccessorService _httpContextAccessorService;

        public PaymentQrService(DbConfig context, IOptions<QrOptions> opt, IHttpContextAccessorService httpContextAccessorService)
        {
            _context = context;
            _opt = opt.Value;
            _httpContextAccessorService = httpContextAccessorService;
        }

        //public async Task<ResponseDTO<VietQrResponseDTO>> CreateBookingPaymentQrAsync(int bookingId)
        //{
        //    // 1) Lấy booking
        //    var booking = await _context.TableBookings
        //        .AsNoTracking()
        //        .Where(b => b.Id == bookingId)
        //        .Select(b => new { b.Id, b.BookingCode, b.TableId })
        //        .FirstOrDefaultAsync();

        //    if (booking == null)
        //    {
        //        return new ResponseDTO<VietQrResponseDTO>
        //        {
        //            IsSuccess = false,
        //            code = 404,
        //            Message = "Không tìm thấy booking."
        //        };
        //    }

        //    // 2) Lấy món hợp lệ (Cooking & Served)
        //    var validStatuses = new[] { "Cooking", "Served" };
        //    var orders = await _context.TableOrders
        //        .AsNoTracking()
        //        .Where(o => o.BookingId == bookingId && validStatuses.Contains(o.Status))
        //        .Select(o => new { o.TotalPrice })
        //        .ToListAsync();

        //    if (orders.Count == 0)
        //    {
        //        return new ResponseDTO<VietQrResponseDTO>
        //        {
        //            IsSuccess = false,
        //            code = 409,
        //            Message = "Chưa có món hợp lệ để thanh toán."
        //        };
        //    }

        //    // 3) Tính tổng
        //    decimal amount = orders.Sum(x => x.TotalPrice ?? 0m);
        //    if (amount <= 0)
        //    {
        //        return new ResponseDTO<VietQrResponseDTO>
        //        {
        //            IsSuccess = false,
        //            code = 409,
        //            Message = "Tổng tiền cần thanh toán không hợp lệ."
        //        };
        //    }

        //    // 4) Tạo ghi chú & QR URL
        //    var yyyyMMdd = DateTime.UtcNow.ToString("yyyyMMdd");
        //    var bookingCodeSafe = string.IsNullOrWhiteSpace(booking.BookingCode) ? bookingId.ToString() : booking.BookingCode.Trim();
        //    var finalNote = $"BOOKING-{yyyyMMdd}-{bookingCodeSafe}";

        //    var path = $"{_opt.BankBin}-{_opt.AccountNumber}-qr_only.png";
        //    var qs = HttpUtility.ParseQueryString(string.Empty);
        //    qs["amount"] = Math.Round(amount, 0, MidpointRounding.AwayFromZero).ToString();
        //    qs["addInfo"] = finalNote;
        //    qs["accountName"] = _opt.AccountName;
        //    var qrUrl = $"{_opt.BaseImageUrl}/{path}?{qs}";

        //    // 5) Kiểm tra đã có Payment QR chưa
        //    var existingQr = await _context.PaymentQr
        //        .FirstOrDefaultAsync(p => p.BookingId == bookingId);

        //    if (existingQr != null)
        //    {
        //        // Cập nhật
        //        existingQr.Amount = amount;
        //        existingQr.Note = finalNote;
        //        existingQr.QrImageUrl = qrUrl;
        //        existingQr.CreatedAt = DateTime.UtcNow;
        //        existingQr.CreatedBy = _httpContextAccessorService.GetAdminId();
        //    }
        //    else
        //    {
        //        // Tạo mới
        //        var entity = new PaymentQrModel
        //        {
        //            BookingId = bookingId,
        //            Amount = amount,
        //            Note = finalNote,
        //            QrImageUrl = qrUrl,
        //            CreatedAt = DateTime.UtcNow,
        //            CreatedBy = _httpContextAccessorService.GetAdminId()
        //        };
        //        _context.PaymentQr.Add(entity);
        //    }

        //    await _context.SaveChangesAsync();

        //    // 6) Trả về
        //    return new ResponseDTO<VietQrResponseDTO>
        //    {
        //        IsSuccess = true,
        //        code = 200,
        //        Message = "Tạo/cập nhật QR thanh toán thành công.",
        //        Data = new VietQrResponseDTO
        //        {
        //            QrImageUrl = qrUrl,
        //            FinalNote = finalNote
        //        }
        //    };
        //}



        public async Task<ResponseDTO<VietQrResponseDTO>> CreateBookingPaymentQrAsync(int bookingId, int bankAccountId)
        {
            // 1. Lấy booking
            var booking = await _context.TableBookings
                .AsNoTracking()
                .Where(b => b.Id == bookingId)
                .Select(b => new { b.Id, b.BookingCode })
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy booking."
                };
            }

            // 2. Lấy món hợp lệ
            var validStatuses = new[] { "Cooking", "Served" };
            var orders = await _context.TableOrders
                .AsNoTracking()
                .Where(o => o.BookingId == bookingId && validStatuses.Contains(o.Status))
                .Select(o => new { o.TotalPrice })
                .ToListAsync();

            if (orders.Count == 0)
            {
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = false,
                    code = 409,
                    Message = "Chưa có món hợp lệ để thanh toán."
                };
            }

            // 3. Tính tổng tiền
            decimal amount = orders.Sum(x => x.TotalPrice ?? 0m);
            if (amount <= 0)
            {
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = false,
                    code = 409,
                    Message = "Tổng tiền cần thanh toán không hợp lệ."
                };
            }

            // 4. Lấy tài khoản ngân hàng đang hoạt động
            var bankAccount = await _context.PaymentQrBankAccounts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == bankAccountId && x.IsActive);

            if (bankAccount == null)
            {
                return new ResponseDTO<VietQrResponseDTO>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Tài khoản ngân hàng không tồn tại hoặc không hoạt động."
                };
            }

            // 5. Tạo ghi chú và URL QR
            var yyyyMMdd = DateTime.UtcNow.ToString("yyyyMMdd");
            var bookingCodeSafe = string.IsNullOrWhiteSpace(booking.BookingCode)
                ? bookingId.ToString()
                : booking.BookingCode.Trim();
            var notePrefix = string.IsNullOrWhiteSpace(bankAccount.NotePrefix)
                ? "BOOKING"
                : bankAccount.NotePrefix.Trim();
            var finalNote = $"{notePrefix}-{yyyyMMdd}-{bookingCodeSafe}";

            var baseImageUrl = "https://img.vietqr.io/image";
            var path = $"{bankAccount.BankBin}-{bankAccount.AccountNumber}-qr_only.png";

            var qs = HttpUtility.ParseQueryString(string.Empty);
            qs["amount"] = Math.Round(amount, 0, MidpointRounding.AwayFromZero).ToString();
            qs["addInfo"] = finalNote;
            qs["accountName"] = bankAccount.AccountName;

            if (bankAccount.EnableAmountLock)
                qs["amountLock"] = "true";

            var qrUrl = $"{baseImageUrl}/{path}?{qs}";

            // 6. Tạo hoặc cập nhật QR
            var existingQr = await _context.PaymentQr.FirstOrDefaultAsync(p => p.BookingId == bookingId);
            var adminId = _httpContextAccessorService.GetAdminId();

            if (existingQr != null)
            {
                existingQr.Amount = amount;
                existingQr.Note = finalNote;
                existingQr.QrImageUrl = qrUrl;
                existingQr.CreatedAt = DateTime.UtcNow;
                existingQr.CreatedBy = adminId;
            }
            else
            {
                var newQr = new PaymentQrModel
                {
                    BookingId = bookingId,
                    Amount = amount,
                    Note = finalNote,
                    QrImageUrl = qrUrl,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = adminId
                };
                _context.PaymentQr.Add(newQr);
            }

            await _context.SaveChangesAsync();

            // 7. Trả kết quả
            return new ResponseDTO<VietQrResponseDTO>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo/cập nhật QR thanh toán thành công.",
                Data = new VietQrResponseDTO
                {
                    QrImageUrl = qrUrl,
                    FinalNote = finalNote
                }
            };
        }

    }
}

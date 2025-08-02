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
        private readonly QrOptions _opt; // cấu hình VietQR: BIN, AccountNumber, AccountName, BaseImageUrl, DefaultNotePrefix
        private readonly IHttpContextAccessorService _httpContextAccessorService;

        public PaymentQrService(DbConfig context, IOptions<QrOptions> opt, IHttpContextAccessorService httpContextAccessorService)
        {
            _context = context;
            _opt = opt.Value;
            _httpContextAccessorService = httpContextAccessorService;
        }

        public async Task<ResponseDTO<VietQrResponseDTO>> CreateBookingPaymentQrAsync(int bookingId )
        {
            // 1) Lấy booking + bookingCode
            var booking = await _context.TableBookings
                .AsNoTracking()
                .Where(b => b.Id == bookingId)
                .Select(b => new { b.Id, b.BookingCode, b.TableId })
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

            // 2) Lấy orders thuộc booking, loại Canceled
            var orders = await _context.TableOrders
         .AsNoTracking()
         .Where(o => o.BookingId == bookingId
                  && ((o.Status ?? "") != "Canceled"))   // hoặc: ((o.Status ?? "").ToLower() != "canceled")
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

            // 3) Tính tổng Amount (bỏ qua null)
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

            // 4) Tạo note: BOOKING-yyyyMMdd-BookingCode
            var yyyyMMdd = DateTime.UtcNow.ToString("yyyyMMdd");
            var bookingCodeSafe = string.IsNullOrWhiteSpace(booking.BookingCode) ? bookingId.ToString() : booking.BookingCode.Trim();
            var finalNote = $"BOOKING-{yyyyMMdd}-{bookingCodeSafe}";

            // 5) Build QR URL (img.vietqr.io)
            var path = $"{_opt.BankBin}-{_opt.AccountNumber}-qr_only.png";
            var qs = HttpUtility.ParseQueryString(string.Empty);
            qs["amount"] = Math.Round(amount, 0, MidpointRounding.AwayFromZero).ToString();
            qs["addInfo"] = finalNote;
            qs["accountName"] = _opt.AccountName;

            var qrUrl = $"{_opt.BaseImageUrl}/{path}?{qs}";

            // 6) Lưu PaymentQrModel
            var entity = new PaymentQrModel
            {
                BookingId = bookingId,
                Amount = amount,
                Note = finalNote,
                QrImageUrl = qrUrl,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = _httpContextAccessorService.GetAdminId()
            };

            _context.PaymentQr.Add(entity);
            await _context.SaveChangesAsync();

            // 7) Trả về
            return new ResponseDTO<VietQrResponseDTO>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo QR thanh toán thành công.",
                Data = new VietQrResponseDTO
                {
                    QrImageUrl = qrUrl,
                    FinalNote = finalNote
                }
            };
        }

    }
}

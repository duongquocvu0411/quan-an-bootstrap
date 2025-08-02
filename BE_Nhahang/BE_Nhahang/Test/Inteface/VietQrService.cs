using BE_Nhahang.Test.DTOtest;
using BE_Nhahang.Test.Option;
using Microsoft.Extensions.Options;
using System.Web;

namespace BE_Nhahang.Test.Inteface
{
    public class VietQrService : IVietQrService
    {
        private readonly VietQrOptions _opt;

        public VietQrService(IOptions<VietQrOptions> options)
        {
            _opt = options.Value;
        }

        public VietQrResponseDTO GeneratePaymentQr(CreateVietQrRequestDTO req)
        {
            if (req.Amount <= 0)
                throw new ArgumentException("Số tiền phải lớn hơn 0.");

            // Chuẩn hoá note: ưu tiên OrderCode -> Note -> DefaultPrefix
            var noteRaw = !string.IsNullOrWhiteSpace(req.OrderCode)
                ? req.OrderCode.Trim()
                : !string.IsNullOrWhiteSpace(req.Note)
                    ? req.Note!.Trim()
                    : $"{_opt.DefaultNotePrefix}-{DateTime.UtcNow:yyyyMMddHHmmss}";

            // (tuỳ bạn) thêm TableId vào note để dễ đối soát
            var finalNote = req.TableId.HasValue ? $"{noteRaw}-T{req.TableId.Value}" : noteRaw;

            // build URL: https://img.vietqr.io/image/{BIN}-{ACCOUNT}-qr_only.png?amount=...&addInfo=...&accountName=...
            var path = $"{_opt.BankBin}-{_opt.AccountNumber}-qr_only.png";
            var qs = HttpUtility.ParseQueryString(string.Empty);

            // amount: nên là số nguyên VND, nhiều ngân hàng chấp nhận decimal nhưng chuẩn là VND nguyên
            qs["amount"] = Math.Round(req.Amount, 0, MidpointRounding.AwayFromZero).ToString();

            // addInfo (nội dung CK)
            qs["addInfo"] = finalNote;

            // accountName (hiển thị tên người nhận trên QR)
            qs["accountName"] = _opt.AccountName;

            // tuỳ chọn: khoá số tiền (mặc định ảnh của vietqr.io sẽ khoá nếu truyền amount)
            // một số triển khai có tham số khác; với img.vietqr.io: chỉ cần có amount là đã “lock”
            // nếu muốn cho phép sửa số tiền, bạn có thể bỏ `amount` khi build URL (không khuyến nghị trong nhà hàng)

            var qrUrl = $"{_opt.BaseImageUrl}/{path}?{qs}";

            return new VietQrResponseDTO
            {
                QrImageUrl = qrUrl,
                FinalNote = finalNote
            };
        }
    }
}

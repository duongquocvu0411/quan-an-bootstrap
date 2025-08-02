namespace BE_Nhahang.Models.Options
{
    public class QrOptions
    {
        public string BaseImageUrl { get; set; } = "https://img.vietqr.io/image";
        public string BankBin { get; set; } = default!;
        public string AccountNumber { get; set; } = default!;
        public string AccountName { get; set; } = default!;
        public string DefaultNotePrefix { get; set; } = "PAY";
    }

}

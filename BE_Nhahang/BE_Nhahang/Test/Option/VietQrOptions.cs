namespace BE_Nhahang.Test.Option
{
    public class VietQrOptions
    {
        public string BankBin { get; set; } = default!;
        public string AccountNumber { get; set; } = default!;
        public string AccountName { get; set; } = default!;
        public string BaseImageUrl { get; set; } = "https://img.vietqr.io/image";
        public string DefaultNotePrefix { get; set; } = "ORDER";
        public bool EnableAmountLock { get; set; } = true;
    }
}

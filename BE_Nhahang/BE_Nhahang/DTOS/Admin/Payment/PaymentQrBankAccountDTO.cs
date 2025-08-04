namespace BE_Nhahang.DTOS.Admin.Payment
{
    public class PaymentQrBankAccountDTO
    {
        public string BankBin { get; set; } = null!;
        public string AccountNumber { get; set; } = null!;
        public string AccountName { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public string? NotePrefix { get; set; }
        public bool EnableAmountLock { get; set; } = true;
    }


    public class VietQRBankResponse
    {
        public string Code { get; set; }
        public string Desc { get; set; }
        public List<VietQRBank> Data { get; set; }
    }

    public class VietQRBank
    {
        public string Bin { get; set; }
        public string Code { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
    }

}

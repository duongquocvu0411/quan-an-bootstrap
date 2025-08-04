using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Entities.Payment
{
    public class PaymentQrBankAccountModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string BankBin { get; set; } = null!;



        public string BankShortName { get; set; }

        [Required]
        [MaxLength(50)]
        public string AccountNumber { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string AccountName { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        [MaxLength(50)]
        public string? NotePrefix { get; set; }

        public bool EnableAmountLock { get; set; } = true;

    
    }
}

using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Auth
{
    public class ChangePasswordRequestDTO
    {
        [Required]
        public string OldPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }

        public string? Otp { get; set; }
    }
}

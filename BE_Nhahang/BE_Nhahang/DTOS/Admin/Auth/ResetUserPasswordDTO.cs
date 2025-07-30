using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Auth
{
    public class ResetUserPasswordDTO
    {
        [Required]
        public string Username { get; set; }
    }
}

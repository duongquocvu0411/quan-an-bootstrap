using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.Models.Jwt
{
    public class LoginModel
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
        public bool RememberMe { get; set; } = false;
    }
}

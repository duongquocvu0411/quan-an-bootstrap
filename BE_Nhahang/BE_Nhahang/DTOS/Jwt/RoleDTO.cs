using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Jwt
{
    public class RoleDTO
    {
        [Required]
        public string Name { get; set; }
    }
}

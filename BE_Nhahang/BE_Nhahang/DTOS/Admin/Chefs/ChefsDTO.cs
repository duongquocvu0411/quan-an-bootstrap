using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Chefs
{
    public class ChefsDTO
    {
        public class ChefsCreateDTO
        {
            [Required]
            public string Name { get; set; }

            [Required]
            public string Role { get; set; }

            [Required]
            public int DisplayOrder { get; set; }

            public IFormFile ImageFile { get; set; }

            public string? TwitterLink { get; set; }
            public string? FacebookLink { get; set; }
            public string? InstagramLink { get; set; }
            public string? LinkedinLink { get; set; }

            public bool IsActive { get; set; } = true;
        }

        public class ChefsUpdateDTO
        {
            [Required]
            public int Id { get; set; }

            [Required]
            public string Name { get; set; }

            [Required]
            public string Role { get; set; }

            [Required]
            public int DisplayOrder { get; set; }

            public IFormFile? ImageFile { get; set; } // Có thể null

            public string? TwitterLink { get; set; }
            public string? FacebookLink { get; set; }
            public string? InstagramLink { get; set; }
            public string? LinkedinLink { get; set; }

            public bool IsActive { get; set; }
        }
    }
}

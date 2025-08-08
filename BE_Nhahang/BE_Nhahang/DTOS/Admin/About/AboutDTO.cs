using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.About
{
    public class AboutDTO
    {

        [Required]
        public string Descriptions { get; set; }

        public int AboutDisplayOrder { get; set; }

        [Required]
        public bool IsActive { get; set; }

        public List<IFormFile>? Images { get; set; } 

        public List<int>? DisplayOrders { get; set; } 
    }

}


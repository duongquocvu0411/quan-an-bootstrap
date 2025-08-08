using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities.About
{
    public class AboutImageModel
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("About")]
        public int AboutId { get; set; }
        
        public int displayOrder { get; set; }

        public string url { get; set; }

        public AboutModel About { get; set; }

    }
}

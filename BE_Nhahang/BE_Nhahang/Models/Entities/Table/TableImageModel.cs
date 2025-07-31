using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE_Nhahang.Models.Entities.Table
{
    public class TableImageModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Table")]
        public int TableId { get; set; }

        public TableModel? Table { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

    }
}

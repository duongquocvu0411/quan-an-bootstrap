using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BE_Nhahang.Models.Entities.Contact
{
    public class ContactUserReplyModel : BaseModels
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ContactUserId { get; set; }

        [ForeignKey(nameof(ContactUserId))]
        [JsonIgnore] 
        public ContactUserModel? ContactUser { get; set; }

        [Required]
        public string ReplyMessage { get; set; }

    }
}

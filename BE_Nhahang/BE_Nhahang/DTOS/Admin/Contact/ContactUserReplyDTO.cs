using System.ComponentModel.DataAnnotations;

namespace BE_Nhahang.DTOS.Admin.Contact
{
    public class ContactUserReplyDTO
    {
        public int ContactUserId { get; set; }

        [Required]
        public string ReplyMessage { get; set; }
    }

}

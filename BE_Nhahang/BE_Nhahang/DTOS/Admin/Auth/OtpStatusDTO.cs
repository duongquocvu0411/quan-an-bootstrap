namespace BE_Nhahang.DTOS.Admin.Auth
{
    public class OtpStatusDTO
    {
        public string Email { get; set; }
        public DateTime LastSent { get; set; }
        public string OtpCode { get; set; }
        public DateTime Expiration { get; set; }
        public int AttemptCount { get; set; } = 0;
    }
}

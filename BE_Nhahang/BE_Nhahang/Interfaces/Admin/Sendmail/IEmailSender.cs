namespace BE_Nhahang.Interfaces.Admin.Sendmail
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlContent);
    }
}

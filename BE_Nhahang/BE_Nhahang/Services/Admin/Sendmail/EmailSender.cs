using BE_Nhahang.Interfaces.Admin.Sendmail;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net.Mail;

namespace BE_Nhahang.Services.Admin.Sendmail
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            await Task.Run(async () =>
            {
                try
                {
                    // Gửi bằng SendGrid
                    var client = new SendGridClient(_config["SendGrid:ApiKey"]);
                    var from = new EmailAddress(_config["SendGrid:SenderEmail"], _config["SendGrid:SenderName"]);
                    var to = new EmailAddress(toEmail);
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);

                    var result = await client.SendEmailAsync(msg);

                    if (result.StatusCode != System.Net.HttpStatusCode.Accepted)
                    {
                        var error = await result.Body.ReadAsStringAsync();
                        Console.WriteLine($"[SendGrid ERROR] {result.StatusCode} - {error}");
                        // fallback to SMTP
                        await SendViaSmtpAsync(toEmail, subject, htmlContent);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[SendGrid EXCEPTION] {ex.Message}");
                    await SendViaSmtpAsync(toEmail, subject, htmlContent);
                }
            });
        }

        private async Task SendViaSmtpAsync(string toEmail, string subject, string htmlContent)
        {
            try
            {
                var message = new MimeKit.MimeMessage();
                message.From.Add(new MimeKit.MailboxAddress(_config["SendGrid:SenderName"], _config["Smtp:Username"]));
                message.To.Add(MimeKit.MailboxAddress.Parse(toEmail));
                message.Subject = subject;

                var bodyBuilder = new MimeKit.BodyBuilder
                {
                    HtmlBody = htmlContent
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                await smtp.ConnectAsync(
                    _config["Smtp:Host"],
                    int.Parse(_config["Smtp:Port"]),
                    MailKit.Security.SecureSocketOptions.StartTls);

                await smtp.AuthenticateAsync(_config["Smtp:Username"], _config["Smtp:Password"]);
                await smtp.SendAsync(message);
                await smtp.DisconnectAsync(true);

                Console.WriteLine($"[SMTP] Fallback mail sent to {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SMTP ERROR] Failed to send fallback email: {ex.Message}");
            }
        }
    }
}

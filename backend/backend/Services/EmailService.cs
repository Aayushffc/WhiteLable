using System.Net;
using System.Net.Mail;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(ApplicationUser user, string verificationCode)
    {
        var subject = "Verify your email address";
        var body =
            $@"
            <h2>Welcome to our application!</h2>
            <p>Please use the following code to verify your email address:</p>
            <h1 style='color: #4CAF50;'>{verificationCode}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>";

        await SendEmailAsync(user.Email!, subject, body);
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetLink)
    {
        var subject = "Reset your password";
        var body =
            $@"
            <h2>Password Reset Request</h2>
            <p>Please click the link below to reset your password:</p>
            <p><a href='{resetLink}'>Reset Password</a></p>
            <p>If you didn't request a password reset, please ignore this email.</p>";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");
            var smtpClient = new SmtpClient(smtpSettings["SmtpServer"])
            {
                Port = int.Parse(smtpSettings["Port"] ?? "587"),
                Credentials = new NetworkCredential(
                    smtpSettings["Username"],
                    smtpSettings["Password"]
                ),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true"),
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(
                    smtpSettings["FromEmail"] ?? "",
                    smtpSettings["FromName"] ?? ""
                ),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email}", to);
            throw;
        }
    }
}

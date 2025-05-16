using backend.Models;
using backend.Services.Interfaces;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace backend.Services;

public class SsoService : ISsoService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SsoService> _logger;
    private readonly IAuthService _authService;

    public SsoService(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        ILogger<SsoService> logger,
        IAuthService authService
    )
    {
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
        _authService = authService;
    }

    public async Task<(bool success, string message, string? token)> GoogleLoginAsync(
        string idToken
    )
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["Authentication:Google:ClientId"] },
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                // Register new user
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    FirstName = payload.GivenName ?? "Google",
                    LastName = payload.FamilyName ?? "User",
                    FullName = payload.Name,
                    EmailConfirmed = true,
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return (
                        false,
                        string.Join(", ", result.Errors.Select(e => e.Description)),
                        null
                    );
                }

                await _userManager.AddToRoleAsync(user, "User");
            }
            else if (user.PasswordHash != null)
            {
                return (false, "This email is already registered. Please use regular login.", null);
            }

            var token = await _authService.GenerateJwtTokenAsync(user);
            return (true, "Google login successful", token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google login failed");
            return (false, "Google authentication failed", null);
        }
    }

    public async Task<(bool success, string message, string? token)> MicrosoftLoginAsync(
        string idToken
    )
    {
        // TODO: Implement Microsoft login
        throw new NotImplementedException("Microsoft login not implemented yet");
    }

    public async Task<(bool success, string message, string? token)> FacebookLoginAsync(
        string accessToken
    )
    {
        // TODO: Implement Facebook login
        throw new NotImplementedException("Facebook login not implemented yet");
    }
}

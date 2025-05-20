using backend.DTOs.Auth;
using backend.Models;

namespace backend.Services.Interfaces;

public interface ISsoService
{
    Task<(bool success, string message, string? token)> GoogleLoginAsync(string idToken);
    Task<(bool success, string message, string? token)> MicrosoftLoginAsync(string idToken);
}

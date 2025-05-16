using backend.DTOs.Auth;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SsoController : ControllerBase
{
    private readonly ISsoService _ssoService;
    private readonly ILogger<SsoController> _logger;

    public SsoController(ISsoService ssoService, ILogger<SsoController> logger)
    {
        _ssoService = ssoService;
        _logger = logger;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO model)
    {
        var (success, message, token) = await _ssoService.GoogleLoginAsync(model.IdToken);
        if (!success)
        {
            return BadRequest(new { message });
        }

        return Ok(new { message, token });
    }

    [HttpPost("microsoft")]
    public async Task<IActionResult> MicrosoftLogin([FromBody] GoogleLoginDTO model)
    {
        var (success, message, token) = await _ssoService.MicrosoftLoginAsync(model.IdToken);
        if (!success)
        {
            return BadRequest(new { message });
        }

        return Ok(new { message, token });
    }

    [HttpPost("facebook")]
    public async Task<IActionResult> FacebookLogin([FromBody] GoogleLoginDTO model)
    {
        var (success, message, token) = await _ssoService.FacebookLoginAsync(model.IdToken);
        if (!success)
        {
            return BadRequest(new { message });
        }

        return Ok(new { message, token });
    }
}

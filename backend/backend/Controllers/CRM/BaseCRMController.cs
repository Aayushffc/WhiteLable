using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.CRM
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseCRMController : ControllerBase
    {
        protected Guid GetTenantId()
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                throw new UnauthorizedAccessException("Tenant ID not found in claims");

            return Guid.Parse(tenantIdClaim);
        }

        protected bool HasRole(string role)
        {
            return User.IsInRole(role);
        }

        protected ActionResult<T> HandleException<T>(Exception ex)
        {
            return ex switch
            {
                UnauthorizedAccessException => Unauthorized(new { message = ex.Message }),
                KeyNotFoundException => NotFound(new { message = "Resource not found" }),
                InvalidOperationException => BadRequest(new { message = ex.Message }),
                _ => StatusCode(500, new { message = "An unexpected error occurred" }),
            };
        }

        protected IActionResult HandleException(Exception ex)
        {
            return ex switch
            {
                UnauthorizedAccessException => Unauthorized(new { message = ex.Message }),
                KeyNotFoundException => NotFound(new { message = "Resource not found" }),
                InvalidOperationException => BadRequest(new { message = ex.Message }),
                _ => StatusCode(500, new { message = "An unexpected error occurred" }),
            };
        }
    }
}

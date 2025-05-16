using backend.DBContext;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TenantMiddleware> _logger;

    public TenantMiddleware(RequestDelegate next, ILogger<TenantMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, TenantDbContextFactory dbContextFactory)
    {
        // Skip tenant resolution for authentication endpoints and public endpoints
        if (IsPublicEndpoint(context.Request.Path))
        {
            await _next(context);
            return;
        }

        var tenantIdentifier = GetTenantIdentifier(context);
        if (string.IsNullOrEmpty(tenantIdentifier))
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(
                new { message = "Tenant identifier is required" }
            );
            return;
        }

        try
        {
            // Get tenant info from main database
            using var mainContext = dbContextFactory.CreateMainDbContext();
            var tenant = await mainContext.Tenants.FirstOrDefaultAsync(t =>
                t.Identifier == tenantIdentifier
            );

            if (tenant == null || !tenant.IsActive)
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsJsonAsync(
                    new { message = "Tenant not found or inactive" }
                );
                return;
            }

            // Create tenant-specific context
            using var tenantContext = await dbContextFactory.CreateTenantDbContextAsync(
                tenantIdentifier
            );

            // Add tenant context to the current request
            context.Items["TenantId"] = tenant.Id;
            context.Items["TenantIdentifier"] = tenant.Identifier;
            context.Items["TenantContext"] = tenantContext;

            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing tenant request: {Message}", ex.Message);
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(
                new { message = "Error processing tenant request" }
            );
        }
    }

    private bool IsPublicEndpoint(PathString path)
    {
        return path.StartsWithSegments("/api/auth")
            || path.StartsWithSegments("/api/account")
            || path.StartsWithSegments("/api/tenant/init")
            || path.StartsWithSegments("/api/Tenant")
            || path.StartsWithSegments("/api/sso")
            || path.StartsWithSegments("/api/Role")
            || path.StartsWithSegments("/swagger")
            || path.StartsWithSegments("/health")
            || path.StartsWithSegments("/favicon.ico");
    }

    private string? GetTenantIdentifier(HttpContext context)
    {
        // Try to get tenant from header
        if (context.Request.Headers.TryGetValue("X-Tenant-Identifier", out var headerValue))
        {
            return headerValue.ToString();
        }

        // Try to get tenant from query string
        if (context.Request.Query.TryGetValue("tenant", out var queryValue))
        {
            return queryValue.ToString();
        }

        // Try to get tenant from user claims
        var tenantClaim = context.User.FindFirst("TenantIdentifier");
        if (tenantClaim != null)
        {
            return tenantClaim.Value;
        }

        return null;
    }
}

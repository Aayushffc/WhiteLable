using backend.DBContext;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace backend.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
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
            // Create tenant-specific context
            using var dbContext = await dbContextFactory.CreateDbContextAsync(tenantIdentifier);

            // Verify tenant exists and is active
            var tenant = await dbContext.Tenants.FirstOrDefaultAsync(t =>
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

            // Add tenant context to the current request
            context.Items["TenantId"] = tenant.Id;
            context.Items["TenantIdentifier"] = tenant.Identifier;
            context.Items["TenantContext"] = dbContext;

            await _next(context);
        }
        catch (Exception ex)
        {
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

using Backend.DBContext;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface ITenantService
{
    Task<Tenant?> GetTenantByIdentifierAsync(string identifier);
    Task<string?> GetConnectionStringAsync(string tenantIdentifier);
    Task<bool> CreateTenantAsync(Tenant tenant);
}

public class TenantService : ITenantService
{
    private readonly ApplicationDbContext _context;

    public TenantService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Tenant?> GetTenantByIdentifierAsync(string identifier)
    {
        return await _context.Tenants.FirstOrDefaultAsync(t =>
            t.Identifier == identifier && t.IsActive
        );
    }

    public async Task<string?> GetConnectionStringAsync(string tenantIdentifier)
    {
        var tenant = await GetTenantByIdentifierAsync(tenantIdentifier);
        return tenant?.ConnectionString;
    }

    public async Task<bool> CreateTenantAsync(Tenant tenant)
    {
        try
        {
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}

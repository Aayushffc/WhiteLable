using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace backend.DBContext;

public class TenantDbContextFactory
{
    private readonly IConfiguration _configuration;
    private readonly string _defaultConnectionString;

    public TenantDbContextFactory(IConfiguration configuration)
    {
        _configuration = configuration;
        _defaultConnectionString =
            _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Default connection string not found");
    }

    public ApplicationDbContext CreateMainDbContext()
    {
        return new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(_defaultConnectionString)
                .Options
        );
    }

    public TenantDbContext CreateTenantDbContext(string tenantIdentifier)
    {
        if (string.IsNullOrEmpty(tenantIdentifier))
        {
            throw new ArgumentException("Tenant identifier is required", nameof(tenantIdentifier));
        }

        // Get the tenant's connection string from the default database
        using var mainContext = CreateMainDbContext();
        var tenant = mainContext.Tenants.FirstOrDefault(t => t.Identifier == tenantIdentifier);

        if (tenant == null)
        {
            throw new InvalidOperationException(
                $"Tenant with identifier {tenantIdentifier} not found"
            );
        }

        // Create a new context with the tenant's connection string
        return new TenantDbContext(
            new DbContextOptionsBuilder<TenantDbContext>()
                .UseSqlServer(tenant.ConnectionString)
                .Options
        );
    }

    public async Task<TenantDbContext> CreateTenantDbContextAsync(string tenantIdentifier)
    {
        if (string.IsNullOrEmpty(tenantIdentifier))
        {
            throw new ArgumentException("Tenant identifier is required", nameof(tenantIdentifier));
        }

        // Get the tenant's connection string from the default database
        using var mainContext = CreateMainDbContext();
        var tenant = await mainContext.Tenants.FirstOrDefaultAsync(t =>
            t.Identifier == tenantIdentifier
        );

        if (tenant == null)
        {
            throw new InvalidOperationException(
                $"Tenant with identifier {tenantIdentifier} not found"
            );
        }

        // Create a new context with the tenant's connection string
        return new TenantDbContext(
            new DbContextOptionsBuilder<TenantDbContext>()
                .UseSqlServer(tenant.ConnectionString)
                .Options
        );
    }
}

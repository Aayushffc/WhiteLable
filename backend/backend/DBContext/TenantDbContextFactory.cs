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

    public ApplicationDbContext CreateDbContext(string? tenantIdentifier = null)
    {
        if (string.IsNullOrEmpty(tenantIdentifier))
        {
            // Return the default context for tenant management
            return new ApplicationDbContext(
                new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseSqlServer(_defaultConnectionString)
                    .Options
            );
        }

        // Get the tenant's connection string from the default database
        using var defaultContext = new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(_defaultConnectionString)
                .Options
        );

        var tenant = defaultContext.Tenants.FirstOrDefault(t => t.Identifier == tenantIdentifier);

        if (tenant == null)
        {
            throw new InvalidOperationException(
                $"Tenant with identifier {tenantIdentifier} not found"
            );
        }

        // Create a new context with the tenant's connection string
        return new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(tenant.ConnectionString)
                .Options
        );
    }

    public async Task<ApplicationDbContext> CreateDbContextAsync(string? tenantIdentifier = null)
    {
        if (string.IsNullOrEmpty(tenantIdentifier))
        {
            // Return the default context for tenant management
            return new ApplicationDbContext(
                new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseSqlServer(_defaultConnectionString)
                    .Options
            );
        }

        // Get the tenant's connection string from the default database
        using var defaultContext = new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(_defaultConnectionString)
                .Options
        );

        var tenant = await defaultContext.Tenants.FirstOrDefaultAsync(t =>
            t.Identifier == tenantIdentifier
        );

        if (tenant == null)
        {
            throw new InvalidOperationException(
                $"Tenant with identifier {tenantIdentifier} not found"
            );
        }

        // Create a new context with the tenant's connection string
        return new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(tenant.ConnectionString)
                .Options
        );
    }
}

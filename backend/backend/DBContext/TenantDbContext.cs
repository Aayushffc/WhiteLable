using Microsoft.EntityFrameworkCore;

namespace backend.DBContext;

public class TenantDbContext : DbContext
{
    public TenantDbContext(DbContextOptions<TenantDbContext> options)
        : base(options) { }

    // Add your tenant-specific DbSet properties here
    // Example:
    // public DbSet<YourTenantSpecificEntity> YourEntities { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure your tenant-specific entity configurations here
    }
}
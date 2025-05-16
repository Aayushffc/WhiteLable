using backend.Models;
using backend.Models.CRM;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.DBContext;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Deal> Deals { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Tenant entity
        builder.Entity<Tenant>(entity =>
        {
            entity.HasIndex(e => e.Identifier).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Identifier).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(255);
        });

        // CRM configurations
        builder.Entity<Customer>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.Status);
        });

        builder.Entity<Contact>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.CustomerId);
            entity.HasIndex(e => e.Email);
        });

        builder.Entity<Deal>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.CustomerId);
            entity.HasIndex(e => e.Stage);
        });
    }
}

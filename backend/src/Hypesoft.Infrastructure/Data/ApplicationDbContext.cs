using Hypesoft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;

namespace Hypesoft.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToCollection("products");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Id)
                  .HasConversion<string>();
            entity.Property(p => p.Name)
                  .IsRequired()
                  .HasMaxLength(100);
            entity.Property(p => p.Description)
                  .IsRequired()
                  .HasMaxLength(1000);
            entity.Property(p => p.Price)
                  .IsRequired()
                  .HasPrecision(10, 2);
            entity.Property(p => p.CategoryId)
                  .IsRequired()
                  .HasConversion<string>();
            entity.Property(p => p.StockQuantity)
                  .IsRequired();
            entity.Property(p => p.CreatedAt)
                  .IsRequired();
            entity.Property(p => p.UpdatedAt)
                  .IsRequired();

            entity.HasIndex(p => p.Name);
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => p.CreatedAt);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToCollection("categories");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id)
                  .HasConversion<string>();
            entity.Property(c => c.Name)
                  .IsRequired()
                  .HasMaxLength(50);
            entity.Property(c => c.Description)
                  .HasMaxLength(200);
            entity.Property(c => c.ProductCount)
                  .IsRequired();
            entity.Property(c => c.CreatedAt)
                  .IsRequired();
            entity.Property(c => c.UpdatedAt)
                  .IsRequired();

            entity.HasIndex(c => c.Name).IsUnique();
            entity.HasIndex(c => c.CreatedAt);
        });
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is Product product)
            {
                if (entry.State == EntityState.Added)
                {
                    product.CreatedAt = DateTime.UtcNow;
                }
                product.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Category category)
            {
                if (entry.State == EntityState.Added)
                {
                    category.CreatedAt = DateTime.UtcNow;
                }
                category.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
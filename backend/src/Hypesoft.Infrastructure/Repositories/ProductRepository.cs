using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly MongoDbContext _context;

    public ProductRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .Find(_ => true)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Product> products, int totalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search = null,
        string? categoryId = null,
        CancellationToken cancellationToken = default)
    {
        if (page <= 0) throw new ArgumentException("Page number must be greater than 0", nameof(page));
        if (pageSize <= 0) throw new ArgumentException("Page size must be greater than 0", nameof(pageSize));

        var filterBuilder = Builders<Product>.Filter;
        var filter = filterBuilder.Empty;

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.Description, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
            filter = filterBuilder.And(filter, searchFilter);
        }

        // Apply category filter
        if (!string.IsNullOrWhiteSpace(categoryId))
        {
            filter = filterBuilder.And(filter, filterBuilder.Eq(p => p.CategoryId, categoryId));
        }

        var totalCount = (int)await _context.Products.CountDocumentsAsync(filter, cancellationToken: cancellationToken);

        var products = await _context.Products
            .Find(filter)
            .SortByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync(cancellationToken);

        return (products, totalCount);
    }

    public async Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Product ID cannot be null or empty", nameof(id));

        return await _context.Products
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(categoryId))
            throw new ArgumentException("Category ID cannot be null or empty", nameof(categoryId));

        return await _context.Products
            .Find(p => p.CategoryId == categoryId)
            .SortBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetLowStockProductsAsync(int threshold, CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .Find(p => p.StockQuantity <= threshold)
            .SortBy(p => p.StockQuantity)
            .ThenBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task CreateAsync(Product product, CancellationToken cancellationToken = default)
    {
        if (product == null)
            throw new ArgumentNullException(nameof(product));

        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.Products.InsertOneAsync(product, null, cancellationToken);
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        await CreateAsync(product, cancellationToken);
    }

    public async Task UpdateAsync(Product product, CancellationToken cancellationToken = default)
    {
        if (product == null)
            throw new ArgumentNullException(nameof(product));

        if (string.IsNullOrWhiteSpace(product.Id))
            throw new ArgumentException("Product ID cannot be null or empty", nameof(product));

        product.UpdatedAt = DateTime.UtcNow;

        var result = await _context.Products.ReplaceOneAsync(
            p => p.Id == product.Id,
            product,
            cancellationToken: cancellationToken);

        if (!result.IsAcknowledged || result.MatchedCount == 0)
            throw new InvalidOperationException($"Product with ID {product.Id} was not found or could not be updated");
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Product ID cannot be null or empty", nameof(id));

        var result = await _context.Products.DeleteOneAsync(p => p.Id == id, cancellationToken);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }

    public async Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
            return false;

        return await _context.Products
            .Find(p => p.Id == id)
            .AnyAsync(cancellationToken);
    }

    public async Task<int> GetCountAsync(CancellationToken cancellationToken = default)
    {
        return (int)await _context.Products.CountDocumentsAsync(_ => true, cancellationToken: cancellationToken);
    }

    public async Task<decimal> GetTotalValueAsync(CancellationToken cancellationToken = default)
    {
        var products = await _context.Products
            .Find(_ => true)
            .Project(p => new { p.Price, p.StockQuantity })
            .ToListAsync(cancellationToken);

        return products.Sum(p => p.Price * p.StockQuantity);
    }
}

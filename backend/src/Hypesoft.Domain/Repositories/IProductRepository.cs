using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<(IEnumerable<Product> products, int totalCount)> GetAllAsync(int page, int pageSize, string? search = null, string? categoryId = null, CancellationToken cancellationToken = default);
    Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetLowStockProductsAsync(int threshold, CancellationToken cancellationToken = default);
    Task CreateAsync(Product product, CancellationToken cancellationToken = default);
    Task AddAsync(Product product, CancellationToken cancellationToken = default);
    Task UpdateAsync(Product product, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default);
    Task<int> GetCountAsync(CancellationToken cancellationToken = default);
    Task<decimal> GetTotalValueAsync(CancellationToken cancellationToken = default);
}

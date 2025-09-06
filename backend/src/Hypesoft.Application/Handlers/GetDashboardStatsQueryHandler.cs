using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Handlers;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetDashboardStatsQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);

        var totalProducts = products.Count();
        var totalValue = products.Sum(p => p.Price * p.StockQuantity);
        var lowStockProducts = products.Where(p => p.StockQuantity < 10).ToList();

        var productsByCategory = categories.Select(category =>
        {
            var categoryProducts = products.Where(p => p.CategoryId == category.Id).ToList();
            return new CategoryStatsDto
            {
                CategoryName = category.Name,
                ProductCount = categoryProducts.Count,
                TotalValue = categoryProducts.Sum(p => p.Price * p.StockQuantity)
            };
        }).ToList();

        return new DashboardStatsDto
        {
            TotalProducts = totalProducts,
            TotalValue = totalValue,
            LowStockProducts = lowStockProducts.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                CategoryId = p.CategoryId,
                CategoryName = categories.FirstOrDefault(c => c.Id == p.CategoryId)?.Name ?? "Sem categoria",
                StockQuantity = p.StockQuantity,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList(),
            ProductsByCategory = productsByCategory
        };
    }
}

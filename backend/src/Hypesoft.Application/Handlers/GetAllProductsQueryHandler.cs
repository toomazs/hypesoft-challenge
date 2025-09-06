using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Handlers;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, PaginatedProductsResult>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetAllProductsQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<PaginatedProductsResult> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        // Usar paginação otimizada diretamente no MongoDB
        var (products, totalCount) = await _productRepository.GetAllAsync(
            request.Page, 
            request.PageSize, 
            request.Search, 
            request.CategoryId, 
            cancellationToken);

        // Buscar apenas as categorias necessárias (otimização)
        var categoryIds = products.Select(p => p.CategoryId).Distinct().Where(id => !string.IsNullOrEmpty(id)).ToList();
        var categories = categoryIds.Any() 
            ? await _categoryRepository.GetByIdsAsync(categoryIds, cancellationToken)
            : new List<Category>();

        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        // Mapear para DTOs
        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            CategoryId = p.CategoryId,
            CategoryName = categoryDict.TryGetValue(p.CategoryId ?? "", out var categoryName) ? categoryName : "Sem categoria",
            StockQuantity = p.StockQuantity,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();

        var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

        return new PaginatedProductsResult
        {
            Data = productDtos,
            TotalCount = totalCount,
            PageNumber = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }
}

using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Handlers;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetProductByIdQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (product == null)
        {
            throw new InvalidOperationException($"Produto com ID {request.Id} não encontrado.");
        }

        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        var category = categories.FirstOrDefault(c => c.Id == product.CategoryId);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            CategoryId = product.CategoryId,
            CategoryName = category?.Name ?? "Sem categoria",
            StockQuantity = product.StockQuantity,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}

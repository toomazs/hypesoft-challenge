using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public UpdateProductCommandHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var existingProduct = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (existingProduct == null)
        {
            throw new InvalidOperationException($"Produto com ID {request.Id} não encontrado.");
        }

        // Atualizar apenas os campos fornecidos
        if (!string.IsNullOrEmpty(request.Name))
            existingProduct.Name = request.Name;
        
        if (!string.IsNullOrEmpty(request.Description))
            existingProduct.Description = request.Description;
        
        if (request.Price.HasValue)
            existingProduct.Price = request.Price.Value;
        
        if (!string.IsNullOrEmpty(request.CategoryId))
            existingProduct.CategoryId = request.CategoryId;
        
        if (request.StockQuantity.HasValue)
            existingProduct.StockQuantity = request.StockQuantity.Value;

        existingProduct.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(existingProduct, cancellationToken);

        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        var category = categories.FirstOrDefault(c => c.Id == existingProduct.CategoryId);

        return new ProductDto
        {
            Id = existingProduct.Id,
            Name = existingProduct.Name,
            Description = existingProduct.Description,
            Price = existingProduct.Price,
            CategoryId = existingProduct.CategoryId,
            CategoryName = category?.Name ?? "Sem categoria",
            StockQuantity = existingProduct.StockQuantity,
            CreatedAt = existingProduct.CreatedAt,
            UpdatedAt = existingProduct.UpdatedAt
        };
    }
}

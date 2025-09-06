using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Handlers;

public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetCategoryByIdQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDto> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (category == null)
        {
            throw new InvalidOperationException($"Categoria com ID {request.Id} não encontrada.");
        }

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }
}

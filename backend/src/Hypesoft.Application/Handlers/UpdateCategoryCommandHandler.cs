using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;

    public UpdateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var existingCategory = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (existingCategory == null)
        {
            throw new InvalidOperationException($"Categoria com ID {request.Id} não encontrada.");
        }

        // Atualizar apenas os campos fornecidos
        if (!string.IsNullOrEmpty(request.Name))
            existingCategory.Name = request.Name;
        
        if (request.Description != null)
            existingCategory.Description = request.Description;

        existingCategory.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.UpdateAsync(existingCategory, cancellationToken);

        return new CategoryDto
        {
            Id = existingCategory.Id,
            Name = existingCategory.Name,
            Description = existingCategory.Description,
            CreatedAt = existingCategory.CreatedAt,
            UpdatedAt = existingCategory.UpdatedAt
        };
    }
}

using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly ICategoryRepository _categoryRepository;

    public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (category == null)
        {
            throw new InvalidOperationException($"Categoria com ID {request.Id} não encontrada.");
        }

        await _categoryRepository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}

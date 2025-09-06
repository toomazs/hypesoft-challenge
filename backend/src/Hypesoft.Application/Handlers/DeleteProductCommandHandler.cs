using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _productRepository;

    public DeleteProductCommandHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (product == null)
        {
            throw new InvalidOperationException($"Produto com ID {request.Id} não encontrado.");
        }

        await _productRepository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}

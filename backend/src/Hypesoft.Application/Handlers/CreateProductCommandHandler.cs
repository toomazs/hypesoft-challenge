using AutoMapper;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

// Este é o "Handler", o cara que sabe o que fazer quando recebe um CreateProductCommand.
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    // Injeção de dependência na veia! Recebemos as ferramentas que precisamos.
    public CreateProductCommandHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Mapeia o comando para a nossa entidade de domínio
        var product = _mapper.Map<Product>(request);

        // Chama o repositório para salvar no banco
        await _productRepository.AddAsync(product);

        // Mapeia a entidade (agora com ID) de volta para um DTO e retorna
        return _mapper.Map<ProductDto>(product);
    }
}
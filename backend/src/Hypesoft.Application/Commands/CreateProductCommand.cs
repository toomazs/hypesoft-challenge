using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands;

// Usando o padrão CQRS. Este é um "Comando", uma intenção de mudar o estado do sistema.
// Ele vai carregar os dados necessários para criar um produto.
// O resultado dele vai ser o DTO do produto criado.
public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    string CategoryId,
    int StockQuantity
) : IRequest<ProductDto>;
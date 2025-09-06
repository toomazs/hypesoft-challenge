using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands;

public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}
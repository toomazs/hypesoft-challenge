using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands;

public class UpdateProductCommand : IRequest<ProductDto>
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? CategoryId { get; set; }
    public int? StockQuantity { get; set; }
}
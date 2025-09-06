using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public class GetProductByIdQuery : IRequest<ProductDto>
{
    public string Id { get; set; } = string.Empty;
}
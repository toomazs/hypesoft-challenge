using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public class GetAllProductsQuery : IRequest<PaginatedProductsResult>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? CategoryId { get; set; }
}

public class PaginatedProductsResult
{
    public List<ProductDto> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
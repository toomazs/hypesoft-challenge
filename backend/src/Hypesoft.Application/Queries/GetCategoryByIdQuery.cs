using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public class GetCategoryByIdQuery : IRequest<CategoryDto>
{
    public string Id { get; set; } = string.Empty;
}

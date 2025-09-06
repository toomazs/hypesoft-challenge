using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands;

public class UpdateCategoryCommand : IRequest<CategoryDto>
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Description { get; set; }
}

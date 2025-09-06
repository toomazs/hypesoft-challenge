using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands;

public class CreateCategoryCommand : IRequest<CategoryDto>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

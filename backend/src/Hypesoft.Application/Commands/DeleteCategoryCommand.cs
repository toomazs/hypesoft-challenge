using MediatR;

namespace Hypesoft.Application.Commands;

public class DeleteCategoryCommand : IRequest<bool>
{
    public string Id { get; set; } = string.Empty;
}

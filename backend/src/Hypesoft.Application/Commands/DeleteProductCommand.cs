using MediatR;

namespace Hypesoft.Application.Commands;

public class DeleteProductCommand : IRequest<bool>
{
    public string Id { get; set; } = string.Empty;
}
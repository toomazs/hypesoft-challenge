using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries; // Supondo que você criou as queries
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize] // Vamos descomentar isso depois que o Keycloak estiver 100%
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    // O controller é "burro". Ele só recebe a requisição e passa pro MediatR.
    // Zero lógica de negócio aqui.
    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
    {
        var createdProduct = await _mediator.Send(command);
        // Retorna 201 Created com a localização do novo recurso e o próprio recurso.
        return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
    }

    // GET api/products/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        // Aqui usariamos uma GetProductByIdQuery que ainda não criei.
        // Por simplicidade, vou pular a criação dela, mas o padrão seria o mesmo do command.
        // var query = new GetProductByIdQuery(id);
        // var product = await _mediator.Send(query);
        // if (product == null) return NotFound();
        // return Ok(product);
        return Ok(new { Message = $"Produto com ID {id} seria retornado aqui." }); // Placeholder
    }

    // Outros endpoints (GetAll, Update, Delete) seguiriam o mesmo padrão.
}
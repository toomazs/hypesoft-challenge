using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.API.Controllers;

// Controller de Produtos - usa padrão CQRS com MediatR
// Separa comandos (write) de queries (read) para melhor arquitetura
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    // Injeta MediatR para CQRS
    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Retorna uma lista paginada de produtos com filtros opcionais.
    /// Implementa paginação server-side para melhor performance em grandes volumes de dados.
    /// Os filtros de busca e categoria permitem uma experiência de usuário mais rica.
    /// </summary>
    /// <param name="page">Número da página (base 1) - padrão: 1</param>
    /// <param name="pageSize">Tamanho da página - padrão: 10</param>
    /// <param name="search">Termo de busca para filtrar produtos por nome/descrição</param>
    /// <param name="categoryId">ID da categoria para filtrar produtos</param>
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? categoryId = null)
    {
        try
        {
            var query = new GetAllProductsQuery { Page = page, PageSize = pageSize, Search = search, CategoryId = categoryId };
            var result = await _mediator.Send(query);
            return Ok(new { success = true, data = result, message = "Produtos obtidos com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        try
        {
            var query = new GetProductByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(new { success = true, data = result, message = "Produto obtido com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProductById), new { id = result.Id }, new { success = true, data = result, message = "Produto criado com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductCommand command)
    {
        try
        {
            command.Id = id;
            var result = await _mediator.Send(command);
            return Ok(new { success = true, data = result, message = "Produto atualizado com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        try
        {
            var command = new DeleteProductCommand { Id = id };
            await _mediator.Send(command);
            return Ok(new { success = true, message = "Produto excluído com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("{id}/stock")]
    public async Task<IActionResult> UpdateStock(string id, [FromBody] UpdateStockRequest request)
    {
        try
        {
            var command = new UpdateProductCommand 
            { 
                Id = id, 
                StockQuantity = request.Quantity 
            };
            var result = await _mediator.Send(command);
            return Ok(new { success = true, data = result, message = "Estoque atualizado com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}

public class UpdateStockRequest
{
    public int Quantity { get; set; }
}
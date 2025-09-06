using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var query = new GetAllCategoriesQuery();
            var result = await _mediator.Send(query);
            return Ok(new { success = true, data = result, message = "Categorias obtidas com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(string id)
    {
        try
        {
            var query = new GetCategoryByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(new { success = true, data = result, message = "Categoria obtida com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetCategoryById), new { id = result.Id }, new { success = true, data = result, message = "Categoria criada com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] UpdateCategoryCommand command)
    {
        try
        {
            command.Id = id;
            var result = await _mediator.Send(command);
            return Ok(new { success = true, data = result, message = "Categoria atualizada com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        try
        {
            var command = new DeleteCategoryCommand { Id = id };
            await _mediator.Send(command);
            return Ok(new { success = true, message = "Categoria excluída com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}

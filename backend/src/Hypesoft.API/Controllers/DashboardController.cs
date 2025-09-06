using Microsoft.AspNetCore.Mvc;
using Hypesoft.Application.Queries;
using Hypesoft.Application.Commands;
using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        try
        {
            var stats = await _mediator.Send(new GetDashboardStatsQuery());
            return Ok(new { success = true, data = stats, message = "Estatísticas obtidas com sucesso" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost("seed")]
    public async Task<IActionResult> SeedData()
    {
        try
        {
            // Criar categorias
            var eletronicos = await _mediator.Send(new CreateCategoryCommand 
            { 
                Name = "Eletrônicos", 
                Description = "Produtos eletrônicos em geral" 
            });
            
            var roupas = await _mediator.Send(new CreateCategoryCommand 
            { 
                Name = "Roupas", 
                Description = "Vestuário e acessórios" 
            });
            
            var casaJardim = await _mediator.Send(new CreateCategoryCommand 
            { 
                Name = "Casa e Jardim", 
                Description = "Produtos para casa e jardim" 
            });

            // Produtos Eletrônicos
            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Smartphone Galaxy S23", 
                Description = "Smartphone Samsung Galaxy S23 128GB", 
                Price = 2499.90m, 
                StockQuantity = 25, 
                CategoryId = eletronicos.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Notebook Dell Inspiron", 
                Description = "Notebook Dell Inspiron 15 i5 8GB 256GB SSD", 
                Price = 3299.00m, 
                StockQuantity = 15, 
                CategoryId = eletronicos.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Fone Bluetooth JBL", 
                Description = "Fone de Ouvido JBL Tune 760NC Bluetooth", 
                Price = 299.90m, 
                StockQuantity = 40, 
                CategoryId = eletronicos.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Smart TV LG 55\"", 
                Description = "Smart TV LED 55\" 4K LG ThinQ AI", 
                Price = 2199.00m, 
                StockQuantity = 8, 
                CategoryId = eletronicos.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Tablet Apple iPad", 
                Description = "iPad 10.2\" 64GB Wi-Fi Space Gray", 
                Price = 2099.00m, 
                StockQuantity = 12, 
                CategoryId = eletronicos.Id 
            });

            // Produtos Roupas
            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Camiseta Nike Dri-FIT", 
                Description = "Camiseta Nike Dri-FIT masculina tamanho M", 
                Price = 89.90m, 
                StockQuantity = 60, 
                CategoryId = roupas.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Calça Jeans Levis", 
                Description = "Calça Jeans Levis 501 Original Masculina", 
                Price = 199.90m, 
                StockQuantity = 35, 
                CategoryId = roupas.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Vestido Zara Floral", 
                Description = "Vestido Zara estampado floral tamanho P", 
                Price = 149.90m, 
                StockQuantity = 22, 
                CategoryId = roupas.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Tênis Adidas Ultraboost", 
                Description = "Tênis Adidas Ultraboost 22 masculino preto", 
                Price = 599.90m, 
                StockQuantity = 18, 
                CategoryId = roupas.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Jaqueta North Face", 
                Description = "Jaqueta The North Face impermeável tamanho M", 
                Price = 449.90m, 
                StockQuantity = 28, 
                CategoryId = roupas.Id 
            });

            // Produtos Casa e Jardim
            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Aspirador de Pó Electrolux", 
                Description = "Aspirador de Pó Electrolux Neo First 1200W", 
                Price = 189.90m, 
                StockQuantity = 14, 
                CategoryId = casaJardim.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Panela de Pressão Rochedo", 
                Description = "Panela de Pressão Rochedo 6L Inox", 
                Price = 129.90m, 
                StockQuantity = 32, 
                CategoryId = casaJardim.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Conjunto de Facas Tramontina", 
                Description = "Conjunto de Facas Tramontina 12 peças", 
                Price = 79.90m, 
                StockQuantity = 45, 
                CategoryId = casaJardim.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Vaso Decorativo Cerâmica", 
                Description = "Vaso decorativo em cerâmica 25cm altura", 
                Price = 39.90m, 
                StockQuantity = 50, 
                CategoryId = casaJardim.Id 
            });

            await _mediator.Send(new CreateProductCommand 
            { 
                Name = "Regador de Jardim 5L", 
                Description = "Regador plástico para jardim capacidade 5L", 
                Price = 19.90m, 
                StockQuantity = 67, 
                CategoryId = casaJardim.Id 
            });

            return Ok(new { success = true, message = "Dados de exemplo criados com sucesso! 3 categorias e 15 produtos foram adicionados." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = $"Erro ao criar dados de exemplo: {ex.Message}" });
        }
    }
}

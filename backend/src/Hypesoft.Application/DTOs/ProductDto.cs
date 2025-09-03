namespace Hypesoft.Application.DTOs;

// DTO (Data Transfer Object) é um objeto simples pra levar dados entre as camadas.
// Ele evita que a gente exponha nossas entidades de domínio direto na API.
// Segurança e desacoplamento, saca?
public class ProductDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = null!;
    public int StockQuantity { get; set; }
}
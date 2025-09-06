using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Hypesoft.Domain.Common;

namespace Hypesoft.Domain.Entities;

// Entidade Product - Core do sistema de produtos
// Usa DDD com validações de negócio na própria entidade
// Suporta MongoDB e EF Core (arquitetura híbrida)
public class Product : BaseEntity
{
    // ID usando ObjectId do MongoDB como string (facilita serialização)
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    // Nome do produto
    public string Name { get; set; } = string.Empty;

    // Descrição detalhada
    public string Description { get; set; } = string.Empty;

    // Preço em decimal (precisão monetária)
    public decimal Price { get; set; }

    // FK para categoria (ObjectId como string)
    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoryId { get; set; } = null!;

    // Quantidade em estoque
    public int StockQuantity { get; set; }
    
    // Data criação (UTC para auditoria)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Data última atualização
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property para EF Core (ignorada no MongoDB)
    [BsonIgnore]
    public virtual Category? Category { get; set; }

    // === Métodos de Domínio (Rich Domain Model) ===
    
    // Atualiza estoque com validação (não pode ser negativo)
    public void UpdateStock(int newQuantity)
    {
        if (newQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(newQuantity));
        
        StockQuantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    // Atualiza preço com validação (deve ser > 0)
    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new ArgumentException("Price must be greater than zero", nameof(newPrice));
        
        Price = newPrice;
        UpdatedAt = DateTime.UtcNow;
    }

    // Verifica se estoque está baixo (threshold padrão: 10)
    public bool IsLowStock(int threshold = 10)
    {
        return StockQuantity <= threshold;
    }
    
}
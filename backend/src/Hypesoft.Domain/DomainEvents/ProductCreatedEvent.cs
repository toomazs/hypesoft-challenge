using Hypesoft.Domain.Common;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.DomainEvents;

public sealed class ProductCreatedEvent : DomainEvent
{
    public string ProductId { get; }
    public string ProductName { get; }
    public string CategoryId { get; }
    public decimal Price { get; }
    public int InitialStock { get; }

    public ProductCreatedEvent(
        string productId,
        string productName,
        string categoryId,
        decimal price,
        int initialStock)
    {
        ProductId = productId;
        ProductName = productName;
        CategoryId = categoryId;
        Price = price;
        InitialStock = initialStock;
    }
}
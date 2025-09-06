using Hypesoft.Domain.Common;

namespace Hypesoft.Domain.DomainEvents;

public sealed class ProductStockUpdatedEvent : DomainEvent
{
    public string ProductId { get; }
    public string ProductName { get; }
    public int PreviousStock { get; }
    public int NewStock { get; }
    public bool IsLowStock { get; }
    public bool IsOutOfStock { get; }

    public ProductStockUpdatedEvent(
        string productId,
        string productName,
        int previousStock,
        int newStock,
        bool isLowStock,
        bool isOutOfStock)
    {
        ProductId = productId;
        ProductName = productName;
        PreviousStock = previousStock;
        NewStock = newStock;
        IsLowStock = isLowStock;
        IsOutOfStock = isOutOfStock;
    }
}
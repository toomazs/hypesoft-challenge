namespace Hypesoft.Application.DTOs;

public class DashboardStatsDto
{
    public int TotalProducts { get; set; }
    public decimal TotalValue { get; set; }
    public List<ProductDto> LowStockProducts { get; set; } = new();
    public List<CategoryStatsDto> ProductsByCategory { get; set; } = new();
}

public class CategoryStatsDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
    public decimal TotalValue { get; set; }
}

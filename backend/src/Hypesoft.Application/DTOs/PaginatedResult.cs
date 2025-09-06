namespace Hypesoft.Application.DTOs;

public class PaginatedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public PaginationMetadata Pagination { get; set; } = new();
    
    public PaginatedResult()
    {
    }

    public PaginatedResult(IEnumerable<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        Pagination = new PaginationMetadata
        {
            CurrentPage = page,
            PageSize = pageSize,
            TotalItems = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            HasNext = page < Math.Ceiling(totalCount / (double)pageSize),
            HasPrevious = page > 1
        };
    }
}

public class PaginationMetadata
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrevious { get; set; }
    public string? NextPageUrl { get; set; }
    public string? PreviousPageUrl { get; set; }
}

public class PaginationRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; } = "asc";

    public int Skip => (Page - 1) * PageSize;
    
    public void ValidateAndNormalize()
    {
        if (Page < 1) Page = 1;
        if (PageSize < 1) PageSize = 10;
        if (PageSize > 100) PageSize = 100; // Limit maximum page size
        
        if (!string.IsNullOrEmpty(SortOrder))
        {
            SortOrder = SortOrder.ToLower();
            if (SortOrder != "asc" && SortOrder != "desc")
                SortOrder = "asc";
        }
    }
}
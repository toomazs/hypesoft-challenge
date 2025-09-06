using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Microsoft.Extensions.Caching.Memory;

namespace Hypesoft.Infrastructure.Repositories;

public class CachedCategoryRepository : ICategoryRepository
{
    private readonly CategoryRepository _repository;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(15);
    private const string CACHE_KEY_ALL = "categories_all";
    private const string CACHE_KEY_PREFIX = "category_";

    public CachedCategoryRepository(CategoryRepository repository, IMemoryCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken)
    {
        var result = await _cache.GetOrCreateAsync(CACHE_KEY_ALL, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = _cacheExpiration;
            return await _repository.GetAllAsync(cancellationToken);
        });

        return result ?? new List<Category>();
    }

    public async Task<IEnumerable<Category>> GetByIdsAsync(List<string> ids, CancellationToken cancellationToken)
    {
        var categories = new List<Category>();
        var missingIds = new List<string>();

        foreach (var id in ids)
        {
            var cacheKey = $"{CACHE_KEY_PREFIX}{id}";
            if (_cache.TryGetValue(cacheKey, out Category? cachedCategory) && cachedCategory != null)
            {
                categories.Add(cachedCategory);
            }
            else
            {
                missingIds.Add(id);
            }
        }

        if (missingIds.Any())
        {
            var missingCategories = await _repository.GetByIdsAsync(missingIds, cancellationToken);
            foreach (var category in missingCategories)
            {
                var cacheKey = $"{CACHE_KEY_PREFIX}{category.Id}";
                _cache.Set(cacheKey, category, _cacheExpiration);
                categories.Add(category);
            }
        }

        return categories;
    }

    public async Task<Category?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var cacheKey = $"{CACHE_KEY_PREFIX}{id}";
        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = _cacheExpiration;
            return await _repository.GetByIdAsync(id, cancellationToken);
        });
    }

    public async Task AddAsync(Category category, CancellationToken cancellationToken)
    {
        await _repository.AddAsync(category, cancellationToken);

        _cache.Remove(CACHE_KEY_ALL);
        var cacheKey = $"{CACHE_KEY_PREFIX}{category.Id}";
        _cache.Set(cacheKey, category, _cacheExpiration);
    }

    public async Task<bool> UpdateAsync(Category category, CancellationToken cancellationToken)
    {
        var result = await _repository.UpdateAsync(category, cancellationToken);

        if (result)
        {
            _cache.Remove(CACHE_KEY_ALL);
            var cacheKey = $"{CACHE_KEY_PREFIX}{category.Id}";
            _cache.Set(cacheKey, category, _cacheExpiration);
        }

        return result;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        var result = await _repository.DeleteAsync(id, cancellationToken);

        if (result)
        {
            _cache.Remove(CACHE_KEY_ALL);
            _cache.Remove($"{CACHE_KEY_PREFIX}{id}");
        }

        return result;
    }
}
using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

// O contrato para o repositório de categorias, também atualizado.
public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken);
    Task<IEnumerable<Category>> GetByIdsAsync(List<string> ids, CancellationToken cancellationToken);
    Task<Category?> GetByIdAsync(string id, CancellationToken cancellationToken);
    Task AddAsync(Category category, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Category category, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken);
}

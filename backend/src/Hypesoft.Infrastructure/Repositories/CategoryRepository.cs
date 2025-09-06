using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Repositories
{
    // A implementação de fato, falando a língua do Mongo.
    public class CategoryRepository : ICategoryRepository
    {
        private readonly MongoDbContext _context;

        public CategoryRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Categories.Find(_ => true).ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Category>> GetByIdsAsync(List<string> ids, CancellationToken cancellationToken)
        {
            if (!ids.Any()) return new List<Category>();

            var filter = Builders<Category>.Filter.In(c => c.Id, ids);
            return await _context.Categories.Find(filter).ToListAsync(cancellationToken);
        }

        public async Task<Category?> GetByIdAsync(string id, CancellationToken cancellationToken)
        {
            return await _context.Categories.Find(c => c.Id == id).FirstOrDefaultAsync(cancellationToken);
        }

        public async Task AddAsync(Category category, CancellationToken cancellationToken)
        {
            await _context.Categories.InsertOneAsync(category, null, cancellationToken);
        }

        public async Task<bool> UpdateAsync(Category category, CancellationToken cancellationToken)
        {
            var result = await _context.Categories.ReplaceOneAsync(c => c.Id == category.Id, category, cancellationToken: cancellationToken);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
        {
            var result = await _context.Categories.DeleteOneAsync(c => c.Id == id, cancellationToken);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
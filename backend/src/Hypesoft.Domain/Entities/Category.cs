using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Hypesoft.Domain.Common;

namespace Hypesoft.Domain.Entities;

/// <summary>
/// Entidade que representa uma categoria de produtos no domínio do sistema.
/// Implementa o padrão Rich Domain Model, encapsulando regras de negócio específicas
/// da categoria, incluindo controle de integridade do contador de produtos.
/// </summary>
public class Category : BaseEntity
{
    /// <summary>
    /// Identificador único da categoria. 
    /// Utiliza ObjectId do MongoDB para compatibilidade com NoSQL, mas mantém flexibilidade
    /// para outros provedores através da representação em string.
    /// </summary>
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    /// <summary>
    /// Nome da categoria. Campo obrigatório que identifica a categoria para o usuário.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descrição detalhada da categoria, fornecendo contexto adicional sobre seu propósito.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Contador denormalizado de produtos na categoria.
    /// Decisão arquitetural para otimização de performance: evita queries complexas
    /// para obter contagens, especialmente importante em dashboards e listagens.
    /// Mantido sincronizado através de métodos de domínio específicos.
    /// </summary>
    public int ProductCount { get; set; } = 0;

    /// <summary>
    /// Data de criação da categoria em UTC.
    /// Padrão de auditoria fundamental para rastreabilidade e compliance.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização em UTC.
    /// Atualizada automaticamente pelos métodos de domínio para garantir consistência.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Propriedade de navegação para relacionamento com produtos.
    /// Ignorada pelo MongoDB (NoSQL) mas mantida para compatibilidade com Entity Framework.
    /// Permite flexibilidade na escolha do provedor de dados sem quebrar o modelo de domínio.
    /// Virtual permite lazy loading quando usando EF Core.
    /// </summary>
    [BsonIgnore]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    /// <summary>
    /// Atualiza o contador de produtos com validação de integridade.
    /// Método de domínio que encapsula a regra de negócio: contador nunca pode ser negativo.
    /// Atualiza automaticamente o timestamp para manter auditoria consistente.
    /// </summary>
    /// <param name="count">Novo valor do contador de produtos</param>
    /// <exception cref="ArgumentException">Lançada quando count é negativo</exception>
    public void UpdateProductCount(int count)
    {
        if (count < 0)
            throw new ArgumentException("Product count cannot be negative", nameof(count));

        ProductCount = count;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Incrementa o contador de produtos em uma unidade.
    /// Método de conveniência que garante atomicidade da operação
    /// e mantém a auditoria de timestamps atualizada.
    /// </summary>
    public void IncrementProductCount()
    {
        ProductCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Decrementa o contador de produtos com proteção contra valores negativos.
    /// Implementa regra de negócio defensiva: não permite que o contador fique negativo
    /// mesmo em cenários de concorrência ou inconsistência de dados.
    /// </summary>
    public void DecrementProductCount()
    {
        if (ProductCount > 0)
        {
            ProductCount--;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
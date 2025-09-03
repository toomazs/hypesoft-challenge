using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Hypesoft.Domain.Entities;

// Essa é a nossa entidade principal, o Produto.
// Usei os atributos do BSON pra já dizer pro MongoDB como ele deve salvar.
// O ObjectId é o tipo de ID padrão do Mongo, super performático.
public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!; // O ID vai ser gerado pelo Mongo

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoryId { get; set; } = null!;

    public int StockQuantity { get; set; }

    // Futuramente, podemos adicionar uma propriedade de navegação pra Categoria aqui,
    // mas com NoSQL, muitas vezes é melhor manter as coisas mais "desacopladas".
}
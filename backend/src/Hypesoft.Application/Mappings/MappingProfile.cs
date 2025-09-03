using AutoMapper;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Mappings;

// AutoMapper é uma mão na roda. Evita que a gente fique fazendo `product.Name = dto.Name`
// um milhão de vezes. A gente define as regras de "de-para" aqui.
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // De: Entidade Product, Para: ProductDto
        CreateMap<Product, ProductDto>().ReverseMap();

        // De: Comando de criação, Para: Entidade Product
        CreateMap<CreateProductCommand, Product>();
    }
}
using AutoMapper;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Mappings;

// Atualizando o AutoMapper pra ele conhecer as classes de Categoria também.
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Mapeamentos de Produto
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<CreateProductCommand, Product>();
        CreateMap<UpdateProductCommand, Product>();

        // Mapeamentos de Categoria
        CreateMap<Category, CategoryDto>().ReverseMap();
        CreateMap<CreateCategoryCommand, Category>();
        CreateMap<UpdateCategoryCommand, Category>();
    }
}
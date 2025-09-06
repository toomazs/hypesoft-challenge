using FluentValidation;
using Hypesoft.Application.Commands;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Validators;

/// <summary>
/// Comprehensive validator for CreateProductCommand with business rules
/// Implements enterprise-level validation patterns
/// </summary>
public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateProductCommandValidator(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;

        ConfigureNameValidation();
        ConfigureDescriptionValidation();
        ConfigurePriceValidation();
        ConfigureStockValidation();
        ConfigureCategoryValidation();
    }

    private void ConfigureNameValidation()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Nome do produto é obrigatório")
            .WithErrorCode("PRODUCT_NAME_REQUIRED")
            .Length(1, 200)
            .WithMessage("Nome do produto deve ter entre 1 e 200 caracteres")
            .WithErrorCode("PRODUCT_NAME_LENGTH");
    }

    private void ConfigureDescriptionValidation()
    {
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Descrição do produto é obrigatória")
            .WithErrorCode("PRODUCT_DESCRIPTION_REQUIRED")
            .Length(1, 1000)
            .WithMessage("Descrição deve ter entre 1 e 1000 caracteres")
            .WithErrorCode("PRODUCT_DESCRIPTION_LENGTH");
    }

    private void ConfigurePriceValidation()
    {
        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Preço deve ser maior ou igual a zero")
            .WithErrorCode("PRODUCT_PRICE_INVALID")
            .LessThan(10000000)
            .WithMessage("Preço não pode exceder R$ 10.000.000,00")
            .WithErrorCode("PRODUCT_PRICE_TOO_HIGH");
    }

    private void ConfigureStockValidation()
    {
        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Quantidade em estoque não pode ser negativa")
            .WithErrorCode("PRODUCT_STOCK_NEGATIVE")
            .LessThan(100000)
            .WithMessage("Quantidade em estoque não pode exceder 100.000 unidades")
            .WithErrorCode("PRODUCT_STOCK_TOO_HIGH");
    }

    private void ConfigureCategoryValidation()
    {
        RuleFor(x => x.CategoryId)
            .MustAsync(CategoryExists)
            .WithMessage("Categoria selecionada não existe")
            .WithErrorCode("PRODUCT_CATEGORY_NOT_FOUND")
            .When(x => !string.IsNullOrEmpty(x.CategoryId));
    }

    private async Task<bool> CategoryExists(string categoryId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(categoryId))
            return true; // Categoria vazia é permitida

        var category = await _categoryRepository.GetByIdAsync(categoryId, cancellationToken);
        return category != null;
    }
}

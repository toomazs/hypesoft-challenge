using FluentValidation;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Validators;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(p => p.Id)
            .NotEmpty().WithMessage("O ID do produto é obrigatório para atualização.");

        RuleFor(p => p.Name)
            .Length(1, 200).WithMessage("O nome do produto deve ter entre 1 e 200 caracteres.")
            .When(p => !string.IsNullOrEmpty(p.Name));

        RuleFor(p => p.Description)
            .Length(1, 1000).WithMessage("A descrição deve ter entre 1 e 1000 caracteres.")
            .When(p => !string.IsNullOrEmpty(p.Description));

        RuleFor(p => p.Price)
            .GreaterThanOrEqualTo(0).WithMessage("O preço do produto deve ser maior ou igual a zero.")
            .When(p => p.Price.HasValue);

        RuleFor(p => p.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("A quantidade em estoque não pode ser negativa.")
            .When(p => p.StockQuantity.HasValue);
    }
}

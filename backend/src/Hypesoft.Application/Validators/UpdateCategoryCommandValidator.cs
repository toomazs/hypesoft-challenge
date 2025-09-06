using FluentValidation;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Validators;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(c => c.Id)
            .NotEmpty().WithMessage("O ID da categoria é obrigatório para atualização.");

        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("O nome da categoria é obrigatório.")
            .Length(3, 50).WithMessage("O nome da categoria deve ter entre 3 e 50 caracteres.");
    }
}

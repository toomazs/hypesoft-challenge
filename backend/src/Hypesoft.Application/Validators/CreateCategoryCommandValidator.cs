using FluentValidation;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Validators;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("O nome da categoria é obrigatório.")
            .Length(3, 50).WithMessage("O nome da categoria deve ter entre 3 e 50 caracteres.");
    }
}


using System.Globalization;

namespace Hypesoft.Domain.ValueObjects;

public sealed class Money : IEquatable<Money>, IComparable<Money>
{
    public decimal Amount { get; }
    public string Currency { get; }

    public static readonly Money Zero = new(0);

    public Money(decimal amount, string currency = "BRL")
    {
        if (amount < 0)
            throw new ArgumentException("Money amount cannot be negative", nameof(amount));

        if (string.IsNullOrWhiteSpace(currency))
            throw new ArgumentException("Currency cannot be empty", nameof(currency));

        Amount = Math.Round(amount, 2, MidpointRounding.AwayFromZero);
        Currency = currency.ToUpperInvariant();
    }

    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException($"Cannot add different currencies: {Currency} and {other.Currency}");

        return new Money(Amount + other.Amount, Currency);
    }

    public Money Subtract(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException($"Cannot subtract different currencies: {Currency} and {other.Currency}");

        var result = Amount - other.Amount;
        if (result < 0)
            throw new InvalidOperationException("Result cannot be negative");

        return new Money(result, Currency);
    }

    public Money Multiply(decimal factor)
    {
        if (factor < 0)
            throw new ArgumentException("Factor cannot be negative", nameof(factor));

        return new Money(Amount * factor, Currency);
    }

    public Money Divide(decimal divisor)
    {
        if (divisor <= 0)
            throw new ArgumentException("Divisor must be positive", nameof(divisor));

        return new Money(Amount / divisor, Currency);
    }

    public bool IsZero => Amount == 0;

    public override string ToString()
    {
        return Currency switch
        {
            "BRL" => Amount.ToString("C", new CultureInfo("pt-BR")),
            "USD" => Amount.ToString("C", new CultureInfo("en-US")),
            "EUR" => Amount.ToString("C", new CultureInfo("de-DE")),
            _ => $"{Amount:F2} {Currency}"
        };
    }

    public string ToString(string format)
    {
        return Amount.ToString(format);
    }

    // Equality and comparison implementation
    public bool Equals(Money? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return Amount == other.Amount && Currency == other.Currency;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Money);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Amount, Currency);
    }

    public int CompareTo(Money? other)
    {
        if (other is null) return 1;
        if (Currency != other.Currency)
            throw new InvalidOperationException($"Cannot compare different currencies: {Currency} and {other.Currency}");

        return Amount.CompareTo(other.Amount);
    }

    // Operators
    public static bool operator ==(Money left, Money right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Money left, Money right)
    {
        return !Equals(left, right);
    }

    public static bool operator <(Money left, Money right)
    {
        return left.CompareTo(right) < 0;
    }

    public static bool operator <=(Money left, Money right)
    {
        return left.CompareTo(right) <= 0;
    }

    public static bool operator >(Money left, Money right)
    {
        return left.CompareTo(right) > 0;
    }

    public static bool operator >=(Money left, Money right)
    {
        return left.CompareTo(right) >= 0;
    }

    public static Money operator +(Money left, Money right)
    {
        return left.Add(right);
    }

    public static Money operator -(Money left, Money right)
    {
        return left.Subtract(right);
    }

    public static Money operator *(Money left, decimal right)
    {
        return left.Multiply(right);
    }

    public static Money operator /(Money left, decimal right)
    {
        return left.Divide(right);
    }

    // Implicit conversions for convenience
    public static implicit operator Money(decimal amount)
    {
        return new Money(amount);
    }

    public static implicit operator decimal(Money money)
    {
        return money.Amount;
    }
}
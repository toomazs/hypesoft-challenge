namespace Hypesoft.Domain.ValueObjects;

public sealed class StockQuantity : IEquatable<StockQuantity>, IComparable<StockQuantity>
{
    public int Value { get; }

    public static readonly StockQuantity Zero = new(0);

    public StockQuantity(int value)
    {
        if (value < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(value));

        Value = value;
    }

    public StockQuantity Add(int quantity)
    {
        if (quantity < 0)
            throw new ArgumentException("Cannot add negative quantity", nameof(quantity));

        return new StockQuantity(Value + quantity);
    }

    public StockQuantity Add(StockQuantity quantity)
    {
        return Add(quantity.Value);
    }

    public StockQuantity Subtract(int quantity)
    {
        if (quantity < 0)
            throw new ArgumentException("Cannot subtract negative quantity", nameof(quantity));

        if (quantity > Value)
            throw new InvalidOperationException("Cannot subtract more than available quantity");

        return new StockQuantity(Value - quantity);
    }

    public StockQuantity Subtract(StockQuantity quantity)
    {
        return Subtract(quantity.Value);
    }

    public bool IsZero => Value == 0;
    public bool IsLow(int threshold = 10) => Value < threshold;
    public bool IsSufficient(int required) => Value >= required;

    public override string ToString()
    {
        return Value.ToString();
    }

    public string ToString(string format)
    {
        return Value.ToString(format);
    }

    // Equality and comparison implementation
    public bool Equals(StockQuantity? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return Value == other.Value;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as StockQuantity);
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public int CompareTo(StockQuantity? other)
    {
        if (other is null) return 1;
        return Value.CompareTo(other.Value);
    }

    // Operators
    public static bool operator ==(StockQuantity left, StockQuantity right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(StockQuantity left, StockQuantity right)
    {
        return !Equals(left, right);
    }

    public static bool operator <(StockQuantity left, StockQuantity right)
    {
        return left.CompareTo(right) < 0;
    }

    public static bool operator <=(StockQuantity left, StockQuantity right)
    {
        return left.CompareTo(right) <= 0;
    }

    public static bool operator >(StockQuantity left, StockQuantity right)
    {
        return left.CompareTo(right) > 0;
    }

    public static bool operator >=(StockQuantity left, StockQuantity right)
    {
        return left.CompareTo(right) >= 0;
    }

    public static StockQuantity operator +(StockQuantity left, StockQuantity right)
    {
        return left.Add(right);
    }

    public static StockQuantity operator -(StockQuantity left, StockQuantity right)
    {
        return left.Subtract(right);
    }

    // Implicit conversions for convenience
    public static implicit operator StockQuantity(int value)
    {
        return new StockQuantity(value);
    }

    public static implicit operator int(StockQuantity quantity)
    {
        return quantity.Value;
    }
}
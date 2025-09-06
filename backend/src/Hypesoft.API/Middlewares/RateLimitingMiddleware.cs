using System.Collections.Concurrent;
using Microsoft.Extensions.Caching.Memory;

namespace Hypesoft.API.Middlewares;

/// <summary>
/// Middleware para rate limiting - previne abuso da API
/// </summary>
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    
    // Configurações de rate limiting
    private readonly int _maxRequestsPerMinute = 100; // 100 requests por minuto por IP
    private readonly int _maxRequestsPerHour = 1000;  // 1000 requests por hora por IP

    public RateLimitingMiddleware(RequestDelegate next, IMemoryCache cache, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _cache = cache;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Endpoints que não precisam de rate limiting rigoroso
        var requestPath = context.Request.Path.Value?.ToLowerInvariant() ?? "";
        var isSystemEndpoint = requestPath.Contains("/health") || 
                              requestPath.Contains("/api/dashboard/seed") ||
                              requestPath.Contains("/swagger") ||
                              requestPath.Contains("/favicon.ico");

        if (isSystemEndpoint)
        {
            await _next(context);
            return;
        }

        var clientIp = GetClientIp(context);
        var currentTime = DateTimeOffset.UtcNow;
        
        // Chaves para cache de rate limiting
        var minuteKey = $"rate_limit_minute_{clientIp}_{currentTime:yyyyMMddHHmm}";
        var hourKey = $"rate_limit_hour_{clientIp}_{currentTime:yyyyMMddHH}";

        // Verificar limite por minuto
        var minuteCount = _cache.Get<int>(minuteKey);
        if (minuteCount >= _maxRequestsPerMinute)
        {
            _logger.LogWarning("Rate limit exceeded for IP {ClientIp} - minute limit", clientIp);
            await SendRateLimitResponse(context, "Too many requests per minute");
            return;
        }

        // Verificar limite por hora
        var hourCount = _cache.Get<int>(hourKey);
        if (hourCount >= _maxRequestsPerHour)
        {
            _logger.LogWarning("Rate limit exceeded for IP {ClientIp} - hour limit", clientIp);
            await SendRateLimitResponse(context, "Too many requests per hour");
            return;
        }

        // Incrementar contadores
        _cache.Set(minuteKey, minuteCount + 1, TimeSpan.FromMinutes(1));
        _cache.Set(hourKey, hourCount + 1, TimeSpan.FromHours(1));

        // Adicionar headers informativos
        context.Response.Headers["X-RateLimit-Minute-Limit"] = _maxRequestsPerMinute.ToString();
        context.Response.Headers["X-RateLimit-Minute-Remaining"] = Math.Max(0, _maxRequestsPerMinute - minuteCount - 1).ToString();
        context.Response.Headers["X-RateLimit-Hour-Limit"] = _maxRequestsPerHour.ToString();
        context.Response.Headers["X-RateLimit-Hour-Remaining"] = Math.Max(0, _maxRequestsPerHour - hourCount - 1).ToString();

        await _next(context);
    }

    private static string GetClientIp(HttpContext context)
    {
        // Verificar headers de proxy primeiro
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static async Task SendRateLimitResponse(HttpContext context, string message)
    {
        context.Response.StatusCode = 429; // Too Many Requests
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            success = false,
            message = message,
            retryAfter = "60" // Retry after 60 seconds
        };

        context.Response.Headers["Retry-After"] = "60";
        
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
    }
}
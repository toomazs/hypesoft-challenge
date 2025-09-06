using Serilog.Context;

namespace Hypesoft.API.Middlewares;

/// <summary>
/// Middleware to handle correlation ID for distributed tracing and request correlation
/// Generates a unique ID for each request and ensures it's available throughout the request pipeline
/// </summary>
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CorrelationIdMiddleware> _logger;
    private const string CorrelationIdHeader = "X-Correlation-Id";

    public CorrelationIdMiddleware(RequestDelegate next, ILogger<CorrelationIdMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetOrGenerateCorrelationId(context);
        
        context.Response.Headers[CorrelationIdHeader] = correlationId;
        
        using (LogContext.PushProperty("CorrelationId", correlationId))
        using (LogContext.PushProperty("RequestPath", context.Request.Path))
        using (LogContext.PushProperty("RequestMethod", context.Request.Method))
        using (LogContext.PushProperty("UserAgent", context.Request.Headers.UserAgent.FirstOrDefault()))
        using (LogContext.PushProperty("RemoteIpAddress", context.Connection.RemoteIpAddress?.ToString()))
        {
            var startTime = DateTime.UtcNow;
            
            try
            {
                _logger.LogInformation("Request started for {RequestMethod} {RequestPath}",
                    context.Request.Method, context.Request.Path);

                await _next(context);

                var duration = DateTime.UtcNow - startTime;
                _logger.LogInformation("Request completed for {RequestMethod} {RequestPath} with status {StatusCode} in {Duration}ms",
                    context.Request.Method, 
                    context.Request.Path, 
                    context.Response.StatusCode,
                    duration.TotalMilliseconds);
            }
            catch (Exception ex)
            {
                var duration = DateTime.UtcNow - startTime;
                _logger.LogError(ex, "Request failed for {RequestMethod} {RequestPath} in {Duration}ms",
                    context.Request.Method, 
                    context.Request.Path,
                    duration.TotalMilliseconds);
                
                throw;
            }
        }
    }

    private string GetOrGenerateCorrelationId(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(CorrelationIdHeader, out var correlationIdValue) 
            && !string.IsNullOrWhiteSpace(correlationIdValue))
        {
            return correlationIdValue.FirstOrDefault() ?? GenerateCorrelationId();
        }

        var alternateHeaders = new[] { "X-Request-Id", "Request-Id", "X-Trace-Id" };
        foreach (var header in alternateHeaders)
        {
            if (context.Request.Headers.TryGetValue(header, out var headerValue) 
                && !string.IsNullOrWhiteSpace(headerValue))
            {
                return headerValue.FirstOrDefault() ?? GenerateCorrelationId();
            }
        }

        return GenerateCorrelationId();
    }

    private static string GenerateCorrelationId()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss");
        var uniquePart = Guid.NewGuid().ToString("N")[..8];
        return $"{timestamp}-{uniquePart}";
    }
}
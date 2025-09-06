using System.Text;
using System.Text.Json;

namespace Hypesoft.API.Middlewares;

public class RequestValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestValidationMiddleware> _logger;
    private readonly HashSet<string> _allowedMethods = new() { "GET", "POST", "PUT", "DELETE", "OPTIONS" };
    private const int MaxRequestSize = 10 * 1024 * 1024; // 10MB

    public RequestValidationMiddleware(RequestDelegate next, ILogger<RequestValidationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var request = context.Request;
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            // Validate HTTP method
            if (!_allowedMethods.Contains(request.Method))
            {
                await WriteErrorResponse(context, 405, "Method not allowed", stopwatch.ElapsedMilliseconds);
                return;
            }

            // Check request size
            if (request.ContentLength > MaxRequestSize)
            {
                await WriteErrorResponse(context, 413, "Request entity too large", stopwatch.ElapsedMilliseconds);
                return;
            }

            // Validate Content-Type for POST/PUT requests
            if ((request.Method == "POST" || request.Method == "PUT") && 
                !string.IsNullOrEmpty(request.ContentType))
            {
                var contentType = request.ContentType.Split(';')[0].Trim().ToLowerInvariant();
                var allowedContentTypes = new[] { "application/json", "multipart/form-data", "application/x-www-form-urlencoded" };
                
                if (!allowedContentTypes.Contains(contentType))
                {
                    await WriteErrorResponse(context, 415, "Unsupported media type", stopwatch.ElapsedMilliseconds);
                    return;
                }
            }

            // Sanitize headers
            SanitizeHeaders(request);

            // Log request
            LogRequest(context, stopwatch.ElapsedMilliseconds);

            await _next(context);

            // Log response
            stopwatch.Stop();
            LogResponse(context, stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Unhandled exception in RequestValidationMiddleware");
            await WriteErrorResponse(context, 500, "Internal server error", stopwatch.ElapsedMilliseconds);
        }
    }

    private void SanitizeHeaders(HttpRequest request)
    {
        // Remove potentially dangerous headers
        var dangerousHeaders = new[] { "X-Forwarded-Host", "X-Original-URL", "X-Rewrite-URL" };
        
        foreach (var header in dangerousHeaders)
        {
            if (request.Headers.ContainsKey(header))
            {
                request.Headers.Remove(header);
            }
        }
    }

    private void LogRequest(HttpContext context, long elapsedMs)
    {
        var request = context.Request;
        
        _logger.LogInformation("Request: {Method} {Path} from {ClientIP} - UserAgent: {UserAgent} - Started at {Timestamp}",
            request.Method,
            request.Path + request.QueryString,
            GetClientIP(context),
            request.Headers.UserAgent.ToString(),
            DateTime.UtcNow);
    }

    private void LogResponse(HttpContext context, long elapsedMs)
    {
        var response = context.Response;
        
        _logger.LogInformation("Response: {StatusCode} - {ElapsedMs}ms - Size: {ContentLength} bytes",
            response.StatusCode,
            elapsedMs,
            response.ContentLength ?? 0);
    }

    private string GetClientIP(HttpContext context)
    {
        var request = context.Request;
        
        // Check X-Forwarded-For header first
        if (request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            var ip = forwardedFor.FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim();
            if (!string.IsNullOrEmpty(ip))
                return ip;
        }

        // Check X-Real-IP header
        if (request.Headers.TryGetValue("X-Real-IP", out var realIP))
        {
            var ip = realIP.FirstOrDefault()?.Trim();
            if (!string.IsNullOrEmpty(ip))
                return ip;
        }

        // Fallback to connection remote IP
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private async Task WriteErrorResponse(HttpContext context, int statusCode, string message, long elapsedMs)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var errorResponse = new
        {
            error = new
            {
                code = statusCode,
                message = message,
                timestamp = DateTime.UtcNow,
                traceId = context.TraceIdentifier
            }
        };

        var json = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json, Encoding.UTF8);

        _logger.LogWarning("Error response: {StatusCode} - {Message} - {ElapsedMs}ms - TraceId: {TraceId}",
            statusCode, message, elapsedMs, context.TraceIdentifier);
    }
}
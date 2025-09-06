using System.Text;
using System.Text.RegularExpressions;

namespace Hypesoft.API.Middlewares;

/// <summary>
/// Middleware para sanitização de entradas - previne ataques de injeção
/// </summary>
public class InputSanitizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<InputSanitizationMiddleware> _logger;

    // Endpoints seguros que não precisam de validação rigorosa
    private static readonly List<string> SafeEndpoints = new()
    {
        "/health",
        "/api/dashboard/seed",
        "/swagger",
        "/favicon.ico",
        "/api/categories",
        "/api/products",
        "/api/dashboard/stats"
    };

    // Padrões maliciosos para detectar tentativas de ataques
    private static readonly List<Regex> MaliciousPatterns = new()
    {
        new Regex(@"<\s*script[^>]*>.*?<\s*/\s*script\s*>", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"javascript\s*:", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"vbscript\s*:", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"onload\s*=", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"onerror\s*=", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"<\s*iframe[^>]*>", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"<\s*object[^>]*>", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"<\s*embed[^>]*>", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        // SQL Injection patterns
        new Regex(@"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER)\b)", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        new Regex(@"(--|#|/\*|\*/)", RegexOptions.IgnoreCase | RegexOptions.Compiled),
        // Command injection patterns
        new Regex(@"(\||;|&|`|\$\()", RegexOptions.IgnoreCase | RegexOptions.Compiled)
    };

    public InputSanitizationMiddleware(RequestDelegate next, ILogger<InputSanitizationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Verificar se é um endpoint seguro (como seed, health, etc.)
        var requestPath = context.Request.Path.Value?.ToLowerInvariant() ?? "";
        if (SafeEndpoints.Any(endpoint => requestPath.Contains(endpoint.ToLowerInvariant())))
        {
            await _next(context);
            return;
        }

        // Apenas verificar para métodos que enviam dados
        if (context.Request.Method == HttpMethods.Post || 
            context.Request.Method == HttpMethods.Put || 
            context.Request.Method == HttpMethods.Patch)
        {
            // Verificar query parameters
            foreach (var param in context.Request.Query)
            {
                if (ContainsMaliciousContent(param.Value.ToString()))
                {
                    _logger.LogWarning("Malicious content detected in query parameter: {ParamKey} from IP: {ClientIP}", 
                        param.Key, GetClientIp(context));
                    
                    await SendMaliciousContentResponse(context);
                    return;
                }
            }

            // Verificar headers suspeitos
            foreach (var header in context.Request.Headers)
            {
                if (ContainsMaliciousContent(header.Value.ToString()))
                {
                    _logger.LogWarning("Malicious content detected in header: {HeaderKey} from IP: {ClientIP}", 
                        header.Key, GetClientIp(context));
                    
                    await SendMaliciousContentResponse(context);
                    return;
                }
            }

            // Para requisições com corpo, verificar o conteúdo
            if (context.Request.ContentLength > 0)
            {
                context.Request.EnableBuffering();
                
                var buffer = new byte[context.Request.ContentLength.Value];
                await context.Request.Body.ReadExactlyAsync(buffer, 0, buffer.Length);
                var body = Encoding.UTF8.GetString(buffer);
                
                if (ContainsMaliciousContent(body))
                {
                    _logger.LogWarning("Malicious content detected in request body from IP: {ClientIP}", GetClientIp(context));
                    
                    await SendMaliciousContentResponse(context);
                    return;
                }

                // Reset stream position
                context.Request.Body.Position = 0;
            }
        }

        await _next(context);
    }

    private static bool ContainsMaliciousContent(string input)
    {
        if (string.IsNullOrEmpty(input))
            return false;

        return MaliciousPatterns.Any(pattern => pattern.IsMatch(input));
    }

    private static string GetClientIp(HttpContext context)
    {
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static async Task SendMaliciousContentResponse(HttpContext context)
    {
        context.Response.StatusCode = 400; // Bad Request
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            success = false,
            message = "Invalid request content detected",
            code = "MALICIOUS_CONTENT_DETECTED"
        };

        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
    }
}
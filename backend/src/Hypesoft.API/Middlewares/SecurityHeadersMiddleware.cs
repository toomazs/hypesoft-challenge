namespace Hypesoft.API.Middlewares;

/// <summary>
/// Middleware para adicionar headers de segurança
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var requestPath = context.Request.Path.Value?.ToLowerInvariant() ?? "";
        var isSwaggerEndpoint = requestPath.Contains("/swagger");

        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["X-Frame-Options"] = isSwaggerEndpoint ? "SAMEORIGIN" : "DENY";
        context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
        context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        
        if (isSwaggerEndpoint)
        {
            context.Response.Headers["Content-Security-Policy"] = 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self'; " +
                "connect-src 'self'; " +
                "frame-ancestors 'self';";
        }
        else
        {
            context.Response.Headers["Content-Security-Policy"] = 
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self'; " +
                "connect-src 'self'; " +
                "frame-ancestors 'none';";
        }

        if (context.Request.IsHttps)
        {
            context.Response.Headers["Strict-Transport-Security"] = 
                "max-age=31536000; includeSubDomains; preload";
        }

        context.Response.Headers["Permissions-Policy"] = 
            "camera=(), " +
            "microphone=(), " +
            "geolocation=(), " +
            "interest-cohort=()";

        context.Response.Headers.Remove("Server");
        
        await _next(context);
    }
}
using System.Net;
using System.Text;
using System.Text.Json;

namespace Hypesoft.API.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = new ErrorResponse();

        switch (exception)
        {
            case ArgumentNullException:
            case ArgumentException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = "Invalid request parameters";
                errorResponse.Details = _environment.IsDevelopment() ? exception.Message : null;
                break;

            case UnauthorizedAccessException:
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse.Message = "Unauthorized access";
                break;

            case KeyNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse.Message = "Resource not found";
                errorResponse.Details = _environment.IsDevelopment() ? exception.Message : null;
                break;

            case TimeoutException:
                response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                errorResponse.Message = "Request timeout";
                break;

            case TaskCanceledException:
                response.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                errorResponse.Message = "Service temporarily unavailable";
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.Message = "An error occurred while processing your request";
                errorResponse.Details = _environment.IsDevelopment() ? exception.Message : null;
                break;
        }

        errorResponse.Code = response.StatusCode;
        errorResponse.Timestamp = DateTime.UtcNow;
        errorResponse.TraceId = context.TraceIdentifier;

        // Log the exception with structured data
        _logger.LogError(exception, 
            "Global exception handler caught exception: {ExceptionType} - {Message} - TraceId: {TraceId} - Path: {Path} - Method: {Method}",
            exception.GetType().Name,
            exception.Message,
            context.TraceIdentifier,
            context.Request.Path,
            context.Request.Method);

        // Log additional context in development
        if (_environment.IsDevelopment())
        {
            _logger.LogError("Stack trace: {StackTrace}", exception.StackTrace);
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = _environment.IsDevelopment()
        };

        var result = JsonSerializer.Serialize(new { error = errorResponse }, options);
        await response.WriteAsync(result, Encoding.UTF8);
    }
}

public class ErrorResponse
{
    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; }
    public string TraceId { get; set; } = string.Empty;
}
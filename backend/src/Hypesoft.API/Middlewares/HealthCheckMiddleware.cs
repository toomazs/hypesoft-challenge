using System.Text.Json;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Hypesoft.API.Middlewares;

/// <summary>
/// Enhanced health check middleware with detailed service status reporting
/// Provides comprehensive health information for monitoring and observability
/// </summary>
public class HealthCheckMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<HealthCheckMiddleware> _logger;
    private readonly HealthCheckService _healthCheckService;

    public HealthCheckMiddleware(
        RequestDelegate next, 
        ILogger<HealthCheckMiddleware> logger,
        HealthCheckService healthCheckService)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _healthCheckService = healthCheckService ?? throw new ArgumentNullException(nameof(healthCheckService));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/health"))
        {
            await HandleHealthCheckAsync(context);
            return;
        }

        await _next(context);
    }

    private async Task HandleHealthCheckAsync(HttpContext context)
    {
        try
        {
            var healthReport = await _healthCheckService.CheckHealthAsync();
            
            var response = new
            {
                status = healthReport.Status.ToString(),
                timestamp = DateTime.UtcNow,
                duration = healthReport.TotalDuration,
                checks = healthReport.Entries.Select(entry => new
                {
                    name = entry.Key,
                    status = entry.Value.Status.ToString(),
                    duration = entry.Value.Duration,
                    description = entry.Value.Description,
                    data = entry.Value.Data?.Any() == true ? entry.Value.Data : null,
                    exception = entry.Value.Exception?.Message
                }).ToArray(),
                system = new
                {
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                    version = GetType().Assembly.GetName().Version?.ToString() ?? "Unknown",
                    machineName = Environment.MachineName,
                    osVersion = Environment.OSVersion.ToString(),
                    processorCount = Environment.ProcessorCount,
                    workingSet = Environment.WorkingSet,
                    gcMemory = GC.GetTotalMemory(false)
                }
            };

            var statusCode = healthReport.Status switch
            {
                HealthStatus.Healthy => 200,
                HealthStatus.Degraded => 200,
                HealthStatus.Unhealthy => 503,
                _ => 500
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            });

            await context.Response.WriteAsync(json);

            _logger.LogInformation("Health check completed with status {HealthStatus} in {Duration}ms",
                healthReport.Status, healthReport.TotalDuration.TotalMilliseconds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed with exception");
            
            context.Response.StatusCode = 503;
            context.Response.ContentType = "application/json";
            
            var errorResponse = new
            {
                status = "Unhealthy",
                timestamp = DateTime.UtcNow,
                error = "Health check service unavailable"
            };

            var json = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}
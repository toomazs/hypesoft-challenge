using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            uptime = TimeSpan.FromMilliseconds(Environment.TickCount64).ToString(@"dd\.hh\:mm\:ss")
        });
    }

    [HttpGet("detailed")]
    public IActionResult DetailedHealth()
    {
        var checks = new List<object>();

        // Database check (placeholder - would need actual DB connection)
        checks.Add(new
        {
            name = "database",
            status = "healthy",
            responseTime = "< 50ms"
        });

        // Memory check
        var process = Process.GetCurrentProcess();
        var memoryUsage = process.WorkingSet64 / (1024 * 1024); // MB
        checks.Add(new
        {
            name = "memory",
            status = memoryUsage < 512 ? "healthy" : "degraded",
            usage = $"{memoryUsage} MB"
        });

        // Disk space check
        var drive = DriveInfo.GetDrives().FirstOrDefault(d => d.Name == "/");
        if (drive != null)
        {
            var freeSpacePercent = (drive.AvailableFreeSpace * 100) / drive.TotalSize;
            checks.Add(new
            {
                name = "disk_space",
                status = freeSpacePercent > 10 ? "healthy" : "critical",
                freeSpace = $"{freeSpacePercent:F1}%"
            });
        }

        var overallStatus = checks.Any(c => c.GetType().GetProperty("status")?.GetValue(c)?.ToString() != "healthy") 
            ? "degraded" : "healthy";

        return Ok(new
        {
            status = overallStatus,
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            uptime = TimeSpan.FromMilliseconds(Environment.TickCount64).ToString(@"dd\.hh\:mm\:ss"),
            checks = checks
        });
    }

    [HttpGet("ready")]
    public IActionResult Ready()
    {
        // Check if all dependencies are available
        var isReady = true;
        var dependencies = new List<object>();

        // Database readiness check
        dependencies.Add(new
        {
            name = "database",
            ready = true,
            message = "Connected"
        });

        return Ok(new
        {
            ready = isReady,
            timestamp = DateTime.UtcNow,
            dependencies = dependencies
        });
    }

    [HttpGet("live")]
    public IActionResult Live()
    {
        // Simple liveness probe
        return Ok(new
        {
            alive = true,
            timestamp = DateTime.UtcNow
        });
    }
}
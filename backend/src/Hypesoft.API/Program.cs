using FluentValidation;
using Hypesoft.API.Middlewares;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Hypesoft.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.EntityFrameworkCore.Extensions;
using Serilog;
using Serilog.Events;
using System.Reflection;


var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
                 .Enrich.FromLogContext()
                 .Enrich.WithProperty("Application", "Hypesoft.API"));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var mongoConnectionString = builder.Configuration["MONGO_CONNECTION_STRING"] ?? 
                           builder.Configuration["MongoDbSettings:ConnectionString"];
var mongoDatabaseName = builder.Configuration["MONGO_DATABASE_NAME"] ?? 
                       builder.Configuration["MongoDbSettings:DatabaseName"];

if (string.IsNullOrEmpty(mongoConnectionString) || string.IsNullOrEmpty(mongoDatabaseName))
{
    throw new InvalidOperationException("MongoDB connection string and database name must be configured");
}

builder.Services.Configure<MongoDbSettings>(options =>
{
    options.ConnectionString = mongoConnectionString;
    options.DatabaseName = mongoDatabaseName;
});

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddMemoryCache();

builder.Services.AddHealthChecks()
    .AddCheck("self", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy())
    .AddCheck("mongodb", () => 
    {
        return Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("MongoDB connection available");
    });

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<ICategoryRepository, CachedCategoryRepository>();

builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.Load("Hypesoft.Application")));
builder.Services.AddValidatorsFromAssembly(Assembly.Load("Hypesoft.Application"), ServiceLifetime.Transient);

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = false;
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
            );

        return new BadRequestObjectResult(new
        {
            success = false,
            message = "Validation failed",
            errors = errors
        });
    };
});

var keycloakAuthority = builder.Configuration["KEYCLOAK_AUTHORITY"] ?? 
                       builder.Configuration["Keycloak:Authority"];
var keycloakAudience = builder.Configuration["KEYCLOAK_AUDIENCE"] ?? 
                      builder.Configuration["Keycloak:Audience"];

if (!string.IsNullOrEmpty(keycloakAuthority) && !string.IsNullOrEmpty(keycloakAudience))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = keycloakAuthority;
            options.Audience = keycloakAudience;
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

    builder.Services.AddAuthorization();
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "Hypesoft ShopSense API", 
        Version = "v1",
        Description = "API para gerenciamento de produtos e categorias",
        Contact = new OpenApiContact
        {
            Name = "Hypesoft Team",
            Email = "contato@hypesoft.com"
        }
    });
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hypesoft ShopSense API v1");
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
        c.EnableFilter();
        c.ShowExtensions();
        c.EnableValidator();
    });
}


app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();
app.UseMiddleware<InputSanitizationMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseSerilogRequestLogging();

app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

app.Run();

public partial class Program { }
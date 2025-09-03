using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Hypesoft.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração dos Serviços (Injeção de Dependência)

// Adiciona o contexto do MongoDB e as configurações
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddSingleton<MongoDbContext>();

// Adiciona os repositórios
builder.Services.AddScoped<IProductRepository, ProductRepository>();
// Adicionar outros repositórios aqui...

// Adiciona AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Adiciona MediatR e registra todos os handlers do assembly da Application
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.Load("Hypesoft.Application")));

// Adiciona os controllers da API
builder.Services.AddControllers();

// Configuração do Swagger/OpenAPI para documentação
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- Configuração de Autenticação com Keycloak ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // De onde os tokens devem ser validados
        options.Authority = builder.Configuration["Jwt:Authority"];
        // Quem é o "público" esperado do token
        options.Audience = builder.Configuration["Jwt:Audience"];
        // Valida se a assinatura do token é confiável
        options.RequireHttpsMetadata = false; // Em dev pode ser false
    });


var app = builder.Build();

// 2. Configuração do Pipeline de Requisições HTTP

// Em ambiente de desenvolvimento, use Swagger e páginas de erro detalhadas
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

// Redireciona HTTP para HTTPS (importante em produção)
// app.UseHttpsRedirection();

app.UseRouting();

// Habilita autenticação e autorização
app.UseAuthentication();
app.UseAuthorization();

// Mapeia os controllers
app.MapControllers();

app.Run();
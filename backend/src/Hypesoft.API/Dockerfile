# Estágio 1: Build da aplicação
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia os arquivos de projeto e restaura as dependências
COPY ["Hypesoft.API/Hypesoft.API.csproj", "Hypesoft.API/"]
COPY ["Hypesoft.Application/Hypesoft.Application.csproj", "Hypesoft.Application/"]
COPY ["Hypesoft.Domain/Hypesoft.Domain.csproj", "Hypesoft.Domain/"]
COPY ["Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj", "Hypesoft.Infrastructure/"]
RUN dotnet restore "Hypesoft.API/Hypesoft.API.csproj"

# Copia todo o resto do código fonte
COPY . .
WORKDIR "/src/Hypesoft.API"

# Compila a aplicação em modo Release
RUN dotnet build "Hypesoft.API.csproj" -c Release -o /app/build

# Estágio 2: Publicação
FROM build AS publish
RUN dotnet publish "Hypesoft.API.csproj" -c Release -o /app/publish

# Estágio 3: Imagem Final (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
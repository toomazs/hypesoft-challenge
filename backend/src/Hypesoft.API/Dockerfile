# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia os arquivos .csproj primeiro para cachear as dependências
COPY src/Hypesoft.API/Hypesoft.API.csproj src/Hypesoft.API/
COPY src/Hypesoft.Application/Hypesoft.Application.csproj src/Hypesoft.Application/
COPY src/Hypesoft.Domain/Hypesoft.Domain.csproj src/Hypesoft.Domain/
COPY src/Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj src/Hypesoft.Infrastructure/

# Restaura as dependências do projeto principal
RUN dotnet restore src/Hypesoft.API/Hypesoft.API.csproj

# Copia o resto do código-fonte
COPY src/ src/

# Publica a aplicação
RUN dotnet publish src/Hypesoft.API/Hypesoft.API.csproj -c Release -o /app/publish

# Estágio Final
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
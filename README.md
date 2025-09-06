# ShopSense - Sistema de Gestão de Produtos

Sistema completo de gestão de produtos desenvolvido para o **Desafio Técnico Hypesoft**, demonstrando arquitetura moderna, boas práticas de desenvolvimento e tecnologias de ponta.

## Funcionalidades Implementadas

### Autenticação e Autorização

- **Keycloak** integrado para autenticação OAuth2/OpenID Connect
- **JWT Token** validação automática
- **Proteção de rotas** no frontend
- **Logout integrado** com Keycloak
- **CORS configurado** corretamente

### Dashboard Inteligente

- **Estatísticas em tempo real** (total de produtos, valor do estoque)
- **Gráficos interativos** com Recharts (produtos por categoria, distribuição de valores)
- **Alertas de estoque baixo** (produtos com menos de 10 unidades)
- **Produtos recentes** com informações detalhadas
- **Cards de métricas** responsivos

### Gestão de Produtos

- **CRUD completo** (Criar, Listar, Editar, Excluir)
- **Busca e filtros** avançados por nome
- **Paginação eficiente** server-side
- **Controle de estoque** em tempo real
- **Validação robusta** de formulários (React Hook Form + Zod)
- **Interface responsiva** para desktop e mobile

### Sistema de Categorias

- **Gestão de categorias** com CRUD completo
- **Associação automática** com produtos
- **Integridade referencial** garantida
- **Contador de produtos** por categoria
- **Validação de exclusão** (não permite deletar categoria com produtos)

### Interface Moderna

- **Design responsivo** seguindo padrão do Dribbble
- **Componentes reutilizáveis** (shadcn/ui + TailwindCSS)
- **Animações suaves** e feedback visual
- **UX intuitiva** e consistente
- **Loading states** e tratamento de erros

## Arquitetura Técnica

### Backend (.NET 9) - Clean Architecture + DDD

```
backend/src/
├── Hypesoft.Domain/              # Camada de Domínio
│   ├── Entities/                 #   Entidades principais (Product, Category)
│   ├── Repositories/             #   Interfaces dos repositórios
│   ├── Common/                   #   Base classes (BaseEntity)
│   ├── ValueObjects/             #   Objetos de valor (Money, StockQuantity)
│   └── DomainEvents/             #   Eventos de domínio
├── Hypesoft.Application/         # Camada de Aplicação
│   ├── Commands/                 #   Comandos CQRS (Create, Update, Delete)
│   ├── Queries/                  #   Consultas CQRS (Get, List)
│   ├── Handlers/                 #   Handlers MediatR
│   ├── DTOs/                     #   Data Transfer Objects
│   ├── Validators/               #   FluentValidation
│   └── Mappings/                 #   AutoMapper profiles
├── Hypesoft.Infrastructure/      # Camada de Infraestrutura
│   ├── Data/                     #   MongoDB Context
│   └── Repositories/             #   Implementações + Cache Decorator
└── Hypesoft.API/                 # Camada de Apresentação
    ├── Controllers/              #   REST API Controllers
    └── Middlewares/              #   Security, CORS, Exception handling
```

### Frontend (Next.js 14) - Arquitetura Modular

```
frontend/src/
├── app/                          # App Router (Next.js 14)
│   ├── (protected)/              #   Rotas protegidas por auth
│   │   ├── dashboard/            #   Dashboard principal
│   │   ├── products/             #   Gestão de produtos
│   │   ├── categories/           #   Gestão de categorias
│   │   └── low-stock/            #   Alertas de estoque
│   ├── login/                    #   Página de login
│   └── test*/                    #   Páginas de teste (não auth)
├── components/                   # Componentes Reutilizáveis
│   ├── ui/                       #   shadcn/ui base components
│   ├── layout/                   #   Layout principal + Sidebar
│   ├── products/                 #   Componentes específicos de produtos
│   └── categories/               #   Componentes específicos de categorias
├── hooks/                        # Custom Hooks
│   ├── useProducts.ts            #   React Query para produtos
│   ├── useCategories.ts          #   React Query para categorias
│   └── useDashboard.ts           #   React Query para dashboard
├── services/                     # Camada de Serviços
│   └── api.ts                    #   Axios + JWT interceptors
├── contexts/                     # Contextos React
│   └── AuthContext.tsx           #   Contexto de autenticação
└── types/                        # TypeScript Types
    └── index.ts                  #   Definições globais
```

## Stack Tecnológica

### Backend

- **.NET 9** com C# 12
- **Clean Architecture** + **DDD** (Domain-Driven Design)
- **CQRS** + **MediatR** pattern
- **MongoDB** com driver oficial
- **FluentValidation** para validação robusta
- **AutoMapper** para mapeamento objeto-objeto
- **Serilog** para logging estruturado
- **Keycloak** integração completa

### Frontend

- **Next.js 14** com App Router
- **React 18** + **TypeScript**
- **TailwindCSS** + **shadcn/ui** para design system
- **React Query/TanStack Query** para cache e sincronização
- **React Hook Form** + **Zod** para validação
- **Recharts** para dashboards e gráficos
- **Keycloak JS** para autenticação frontend
- **Axios** com interceptors JWT

### Infraestrutura

- **Docker** + **Docker Compose**
- **MongoDB 5.0** como banco principal
- **Keycloak 25.0** como Identity Provider
- **Mongo Express** para administração do BD
- **Nginx** como reverse proxy

## Como Executar

### Pré-requisitos

- **Docker Desktop** 4.0+
- Node.js 18+
- .NET 9 SDK
- Git
  
- **Git**

### 1. Clone o projeto

```bash
# Clone o repositório
git clone https://github.com/toomazs/hypesoft-challenge.git
cd hypesoft-challenge
```
### 2. Apos isso, duplo clique no .inicializar-projeto.bat. Ele vai fazer tudo por voce.

```bash
.inicializar-projeto.bat
```

### 3. Acesse as Aplicações

| Serviço        | URL                           | Descrição           |
| -------------- | ----------------------------- | ------------------- |
| Frontend       | http://localhost:3000         | Interface principal |
| API            | http://localhost:5000/api     | REST API            |
| Swagger        | http://localhost:5000/swagger | Documentação da API |
| MongoDB Admin  | http://localhost:8081         | Mongo Express       |
| Keycloak Admin | http://localhost:8080         | Keycloak Console    |

### 4. Login no Sistema

- Usuário: `admin`
- Senha: `admin123`

### 5. Dados de Exemplo

O sistema já vem com dados pré-populados:

- 15 produtos distribuídos em 3 categorias
- 3 categorias: Eletrônicos, Roupas, Casa e Jardim
- 1 produto com estoque baixo para testar alertas

## Teste de Performance

Execute o arquivo `.teste-endpoints.bat` (Windows) para verificar performance:

```bash
.teste-endpoints.bat
```

Métricas Esperadas:

- Categorias: ~10ms
- Produtos: ~50ms
- Dashboard: ~20ms
- Todos endpoints < 500ms

## Segurança Implementada

### Middlewares de Segurança

- Global Exception Handler - Tratamento seguro de erros
- CORS Policy - Configurado para localhost (dev)
- Security Headers - Proteção contra XSS, clickjacking
- Rate Limiting - 100 req/min, 1000 req/hora
- Input Sanitization - Proteção contra injection attacks
- JWT Validation - Tokens obrigatórios para operações críticas

### Autenticação Robusta

- Keycloak Integration - Industry standard
- JWT Tokens - Stateless authentication
- Auto Refresh - Token refresh automático
- Logout Completo - Session cleanup

## Padrões Arquiteturais Implementados

### Backend

- Clean Architecture - Separação clara de responsabilidades
- Domain-Driven Design - Entidades ricas com validações
- CQRS - Commands/Queries separados
- Repository Pattern - Abstração da camada de dados
- Decorator Pattern - Cache layer nos repositórios
- Mediator Pattern - Desacoplamento via MediatR

### Frontend

- Component-Based Architecture - Reutilização máxima
- Custom Hooks - Lógica compartilhada
- React Query - Cache inteligente e sincronização
- Context API - Gerenciamento de estado global
- Compound Components - Flexibilidade na composição

## Diferenciais Técnicos Implementados

### Performance

- Server-side Pagination - Eficiência em grandes volumes
- React Query Cache - Reduz requisições desnecessárias
- Component Lazy Loading - Code splitting automático
- MongoDB Indexação - Queries otimizadas
- Nginx Proxy - Load balancing preparado

### Observabilidade

- Health Checks - Monitoramento de todos os serviços
- Structured Logging - Logs JSON com Serilog
- Error Boundaries - Tratamento gracioso de erros React
- Global Exception Handler - Logs centralizados de erros
- Correlation IDs - Rastreabilidade de requisições

### Qualidade de Código

- TypeScript Strict - Type safety completo
- ESLint + Prettier - Code standards
- FluentValidation - Validações expressivas
- SOLID Principles - Aplicados consistentemente
- Clean Code - Código legível e manutenível

### Segurança Avançada

- Defense in Depth - Múltiplas camadas de proteção
- Input Sanitization - XSS/Injection prevention
- JWT Best Practices - Secure token handling
- CORS Restrictive - Apenas origins permitidos
- Rate Limiting - DoS protection

## Monitoramento e Saúde

### Health Checks Implementados

```bash
# Verificar saúde de todos os serviços
curl http://localhost:5000/health
```

Status esperado:

```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.0123456",
  "entries": {
    "MongoDB": { "status": "Healthy" },
    "API": { "status": "Healthy" }
  }
}
```

## Comandos Úteis

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Logs específicos
docker-compose logs backend
docker-compose logs frontend

# Restart de serviço específico
docker-compose restart backend

# Limpar e rebuildar tudo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Ver status detalhado
docker-compose ps
```

## Checklist de Funcionalidades

### Requisitos Principais (100% Completo)

- [x] Sistema de autenticação Keycloak
- [x] CRUD completo de produtos
- [x] CRUD completo de categorias
- [x] Controle de estoque
- [x] Dashboard com métricas
- [x] Alertas de estoque baixo
- [x] Busca e filtros
- [x] Paginação eficiente
- [x] Interface responsiva
- [x] Validação robusta

### Requisitos Técnicos (100% Completo)

- [x] Clean Architecture + DDD
- [x] CQRS + MediatR
- [x] MongoDB integrado
- [x] Docker Compose funcional
- [x] Performance < 500ms
- [x] Segurança implementada
- [x] Health checks
- [x] Logs estruturados

### Diferenciais Implementados

- [x] Keycloak integração completa
- [x] React Query para cache
- [x] shadcn/ui design system
- [x] Recharts para dashboards
- [x] TypeScript strict mode
- [x] Middleware pipeline completo
- [x] Error handling robusto
- [x] Nginx reverse proxy

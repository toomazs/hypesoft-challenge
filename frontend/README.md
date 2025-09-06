# ShopSense Frontend

Frontend do sistema ShopSense desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI baseados em Radix UI
- **React Query** - Gerenciamento de estado e cache
- **Keycloak** - Autenticação e autorização
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 📦 Instalação

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Keycloak Configuration
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-client-frontend
```

3. **Executar em desenvolvimento:**

```bash
npm run dev
```

4. **Build para produção:**

```bash
npm run build
npm start
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (protected)/       # Rotas protegidas (requerem auth)
│   │   ├── dashboard/     # Dashboard principal
│   │   └── products/      # Gestão de produtos
│   ├── login/             # Página de login
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── layout/           # Componentes de layout
├── contexts/             # Contextos React (Auth)
├── hooks/                # Custom hooks
├── services/             # Serviços de API
├── types/                # Definições TypeScript
└── lib/                  # Utilitários
```

## 🔐 Autenticação

O sistema utiliza **Keycloak** para autenticação:

- **Login**: Redirecionamento para Keycloak
- **Logout**: Logout integrado com Keycloak
- **Proteção de rotas**: Middleware automático
- **Refresh de token**: Automático
- **Roles**: Baseado em roles do Keycloak

## 📱 Funcionalidades

### Dashboard

- Estatísticas em tempo real
- Gráficos de produtos por categoria
- Alertas de estoque baixo
- Produtos recentes

### Gestão de Produtos

- CRUD completo de produtos
- Busca e filtros
- Paginação
- Validação de formulários
- Controle de estoque

### Categorias

- Gestão de categorias
- Associação com produtos
- Validação de integridade

## 🎨 Design System

- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes base
- **Design responsivo** para mobile e desktop
- **Tema claro/escuro** (preparado)
- **Ícones Lucide** para consistência visual

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes em modo watch
npm run test:watch

# Verificação de tipos
npm run type-check
```

## 🚀 Deploy

### Docker

```bash
# Build da imagem
docker build -t hypesoft-frontend .

# Executar container
docker run -p 3000:3000 hypesoft-frontend
```

### Vercel

```bash
# Deploy automático
vercel --prod
```

## 📊 Performance

- **Code splitting** automático
- **Lazy loading** de componentes
- **Cache** com React Query
- **Otimização de imagens** (Next.js)
- **Bundle analyzer** disponível

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Linting do código
- `npm run type-check` - Verificação de tipos

### Padrões de Código

- **ESLint** para qualidade
- **Prettier** para formatação
- **TypeScript strict mode**
- **Conventional Commits**

## 📚 Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte do desafio técnico da Hypesoft.

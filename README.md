# Sistema de Gerenciamento de Leads e Campanhas

Um sistema backend para gerenciar leads, grupos e campanhas usando Node.js, Express, TypeScript e Prisma.

## 🚀 Funcionalidades

- Gerenciamento completo de leads (CRUD)
- Organização de leads em grupos
- Gestão de campanhas de marketing
- Acompanhamento do status de leads em campanhas
- API RESTful com documentação completa

## 🛠️ Tecnologias

- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Node.js & Express**: Backend rápido e escalável
- **Prisma ORM**: ORM moderno para interação com o banco de dados
- **PostgreSQL**: Banco de dados relacional
- **Zod**: Validação de dados
- **Padrões de Arquitetura**: Repositories, Services e Controllers
- **Jest**: Testes automatizados

## 📋 Pré-requisitos

- Node.js v16+
- PostgreSQL ou Docker

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/leads-management.git
   cd leads-management

2. Instale as dependências:
   ```bash
   npm install

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev

5. Inicie o servidor:
   ```bash
   npm run dev

## 📚 Estrutura do Projeto
   ```bass
    src/
    ├── controllers/     # Controladores para manipulação de requisições
    ├── services/        # Lógica de negócios
    ├── repositories/    # Abstração de acesso ao banco de dados
    ├── routes/          # Definição de rotas da API
    ├── middlewares/     # Middlewares Express
    ├── errors/          # Classes e handlers de erro
    └── server.ts        # Ponto de entrada da aplicação
   ```

## 📖 Documentação da API


## 🧪 Testes


## 🤝 Contribuindo


## 📄 Licença
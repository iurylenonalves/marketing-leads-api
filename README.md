# Leads and Campaigns Management System

A backend system for managing leads, groups, and campaigns using Node.js, Express, TypeScript, and Prisma ORM.

## 🌐 Live Demo

The API is deployed on a custom VPS using a modern containerized architecture. 

- **API URL**: [https://api.iurylenon.com](https://api.iurylenon.com)
- **API Documentation**: [https://api.iurylenon.com/api-docs](https://api.iurylenon.com/api-docs)

## 🚀 Features

- Complete lead management (CRUD)
- Organization of leads into groups
- Marketing campaign management
- Tracking lead status in campaigns
- RESTful API with comprehensive documentation
- Clean architecture with separation of concerns
- Fully containerized deployment with automated SSL generation

## 🛠️ Technologies

- **TypeScript**: Static typing for improved safety and productivity
- **Node.js & Express**: Fast and scalable backend
- **Prisma ORM**: Modern ORM for database interaction
- **PostgreSQL**: Relational database system
- **Zod**: Data validation and type safety
- **Docker & Docker Compose**: Containerization and orchestration for reliable deployments
- **Traefik**: Cloud-native edge router and reverse proxy with automatic SSL (Let's Encrypt)
- **Jest & Supertest**: Testing framework and HTTP assertions
- **Architecture Patterns**: Repositories, Services, and Controllers
- **API Documentation**: Swagger/OpenAPI
- **SOLID Principles**: Clean, maintainable code design

## 📋 Prerequisites

- Node.js v24+ (For local development)
- PostgreSQL
- Docker & Docker Compose (For production deployment)

## 🔧 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/iurylenonalves/marketing-leads-api.git
   cd marketing-leads-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

##🐳 Production Deployment (Docker)

This project is configured to run in a production environment using Docker and Traefik as a reverse proxy.

1. Ensure you have a Traefik instance running on your server and a Docker network named web created.
   ```bash
   docker network create web
   ```

2. Clone the repository on your server and navigate to it:
   ```bash
   git clone https://github.com/iurylenonalves/marketing-leads-api.git
   cd marketing-leads-api
   ```

3. Create the production .env file (never commit this file):
   ```bash
   nano .env
   ```

   Note: If your PostgreSQL is running on the host machine, use host.docker.internal in your DATABASE_URL.

   ```bash
   DATABASE_URL="postgresql://user:password@host.docker.internal:5432/marketing_leads_db?schema=public"
   PORT=3000
   ```

4. Build and start the container:
   ```bash
   docker compose up -d --build
   ```

5. Run Prisma migrations inside the container (if necessary):
   ```bash
   docker exec -it marketing-leads-api npx prisma migrate deploy
   ```

## 📚 Project Structure
   ```bash
    src/
├── __tests__/       # End-to-end (E2E) tests
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access abstraction
├── database/        # Database connection and configuration
├── routes/          # API routes definition
│   ├── index.ts     # Routes aggregator
│   ├── leads.routes.ts
│   ├── groups.routes.ts
│   ├── campaigns.routes.ts
│   ├── groupLeads.routes.ts
│   └── campaignLeads.routes.ts
├── middlewares/     # Express middlewares
├── errors/          # Error classes and handlers
├── app.ts           # App configuration
├── server.ts        # Application entry point
└── swagger.ts       # Swagger configuration
   ```

## 🏗️ Architecture & Database

### System Architecture
![System Architecture](./docs/images/diagrams/architecture_diagram.png)

This architecture follows a layered approach with:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Abstract data access operations
- **Database**: PostgreSQL with Prisma ORM

### Database Schema
![Database Schema](./docs/images/diagrams/database_diagram.png)

The database schema shows the relationships between:
- **Leads**: Core entity representing potential customers
- **Groups**: Collections of leads for organization
- **Campaigns**: Marketing initiatives targeting leads
- **Relationships**: Many-to-many connections between entities

## 📖 API Documentation
The API is documented using Swagger/OpenAPI. When the server is running, you can access the interactive documentation at:

**Local Development:**
```
http://localhost:3000/api-docs
```

**Production**
```
https://api.iurylenon.com/api-docs
```
The Swagger UI allows you to explore and test all API endpoints directly in your browser.

### Interactive Demo

![API Demo](./docs/images/swagger_demo.gif)
*Quick walkthrough of creating a lead and adding it to a group*

### Documentation Screenshots

![Swagger Overview](./docs/images/screenshots/api-server-swagger01.PNG)

![Swagger Overview](./docs/images/screenshots/api-server-wagger02.PNG)
*Overview of all API endpoints in Swagger UI*


### Available Endpoints

#### Leads

- GET /api/leads - List all leads
- POST /api/leads - Create a new lead
- GET /api/leads/:id - Get a specific lead
- PUT /api/leads/:id - Update a lead
- DELETE /api/leads/:id - Delete a lead

#### Groups

- GET /api/groups - List all groups
- POST /api/groups - Create a new group
- GET /api/groups/:id - Get a specific group
- PUT /api/groups/:id - Update a group
- DELETE /api/groups/:id - Delete a group

#### Leads in Groups

- GET /api/groups/:groupId/leads - List leads in a group
- POST /api/groups/:groupId/leads - Add a lead to a group
- DELETE /api/groups/:groupId/leads/:leadId - Remove a lead from a group

#### Campaigns

- GET /api/campaigns - List all campaigns
- POST /api/campaigns - Create a new campaign
- GET /api/campaigns/:id - Get a specific campaign
- PUT /api/campaigns/:id - Update a campaign
- DELETE /api/campaigns/:id - Delete a campaign

#### Leads in Campaigns

- GET /api/campaigns/:campaignId/leads - List leads in a campaign
- POST /api/campaigns/:campaignId/leads - Add a lead to a campaign
- PUT /api/campaigns/:campaignId/leads/:leadId - Update lead status in a campaign
- DELETE /api/campaigns/:campaignId/leads/:leadId - Remove a lead from a campaign

## 🔒 Clean Architecture
This project follows clean architecture principles:

1. Separation of Concerns: Each layer has a specific responsibility
2. Dependency Inversion: High-level modules don't depend on low-level modules
3. Repository Pattern: Data access is abstracted behind interfaces
4. Service Layer: Business logic is isolated from controllers
5. Input Validation: Request data is validated before processing

## 🧪 Tests

The project includes unit tests for services and end-to-end (E2E) tests for API endpoints.

To run the tests:

```bash
# Run all tests
npm test

# Run only E2E tests
npm run test:e2e
```

## 🤝 Contributing
Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📄 Licença
This project is licensed under the MIT License - see the LICENSE.md file for details.

## 👨‍💻 Author
[Iury Lenon](https://github.com/iurylenonalves)

Feel free to reach out if you have questions or suggestions!

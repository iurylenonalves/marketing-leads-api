import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Lead Management API',
    version: '1.0.0',
    description: 'API to manage leads, groups, and marketing campaigns',
    contact: {
      name: 'Your Name',
      url: 'https://github.com/seu-usuario/leads-management',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Leads',
      description: 'Operations related to leads',
    },
    {
      name: 'Groups',
      description: 'Operations related to groups',
    },
    {
      name: 'Campaigns',
      description: 'Operations related to campaigns',
    },
    {
      name: 'Group Leads',
      description: 'Operations related to leads in groups',
    },
    {
      name: 'Campaign Leads',
      description: 'Operations related to leads in campaigns',
    },
  ],
  components: {
    schemas: {
      Lead: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          phone: {
            type: 'string',
            example: '(555) 123-4567',
          },
          status: {
            type: 'string',
            enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Archived'],
            example: 'New',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Group: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'VIP Customers',
          },
          description: {
            type: 'string',
            example: 'Our most important customers',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Campaign: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Summer Sale 2023',
          },
          description: {
            type: 'string',
            example: 'Promotion for summer products',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Resource not found',
          },
          statusCode: {
            type: 'integer',
            example: 404,
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rota
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: any, port: number) => {
  // Rota para acessar a documentação
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Rota para o arquivo JSON da documentação
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`📚 Swagger docs disponíveis em http://localhost:${port}/api-docs`);
};

export { swaggerDocs };
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Lead Management API',
    version: '1.0.0',
    description: 'API to manage leads, groups, and marketing campaignsn\n' +
    '**Links:**\n' +
    '- [GitHub Repository](https://github.com/iurylenonalves/marketing-leads-api)\n' +
    '- [LinkedIn](https://www.linkedin.com/in/iurylenonalves/)',
    contact: {
      name: 'Iury Lenon',
      url: 'https://www.linkedin.com/in/iurylenonalves/',
    },

    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [    
    {
      url: '/api',
      description: 'API server',
    }    
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
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Express, port: number) => {
  const swaggerUiOptions = {
    explorer: true,
    docExpansion: 'list',
  };
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
};

export { swaggerDocs };
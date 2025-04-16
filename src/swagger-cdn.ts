import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Lead Management API',
    version: '1.0.0',
    description: 'API to manage leads, groups, and marketing campaigns',
    contact: {
      name: 'Iury Lenon',
      url: 'https://github.com/iurylenonalves/marketing-leads-api.git',
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

const swaggerCdnDocs = (app: Express, port: number) => {  
  // Rota para servir o JSON do Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Página HTML do Swagger UI usando CDN
  app.get('/api-docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lead Management API - Swagger UI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css">
      <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.5.0/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.5.0/favicon-16x16.png" sizes="16x16" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          // Check hash in URL for deepLinking to work
          const urlParams = new URLSearchParams(window.location.search);
          const ui = SwaggerUIBundle({
            url: window.location.origin + "/api-docs.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            docExpansion: 'list',
            filter: true,
            tryItOutEnabled: true,
            syntaxHighlight: {
              activate: true,
              theme: "agate"
            },
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            onComplete: function() {
              // Enable any tag that is in the URL
              if (window.location.hash) {
                console.log("Hash found:", window.location.hash);
                const tagName = window.location.hash.substring(2); // Remove o #/
                setTimeout(() => {
                  // Try to expand the tag automatically
                  const tagElements = document.querySelectorAll('.opblock-tag');
                  for (const elem of tagElements) {
                    if (elem.textContent.trim() === tagName) {
                      elem.click();
                      break;
                    }
                  }
                }, 500);
              }
            }
          });
          window.ui = ui;
        }
      </script>
    </body>
    </html>
    `);
  });

  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
};

export { swaggerCdnDocs };
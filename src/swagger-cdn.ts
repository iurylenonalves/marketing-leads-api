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
    res.setHeader('Access-Control-Allow-Origin', '*');
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
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css">
      <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.15.5/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.15.5/favicon-16x16.png" sizes="16x16" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          // Fixed configuration - using newer version of Swagger UI
          const ui = SwaggerUIBundle({
            url: window.location.origin + "/api-docs.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'none',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            validatorUrl: null,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            onComplete: function() {
              // Handle navigation after UI is loaded
              const handleNavigation = () => {
                if (window.location.hash && window.location.hash.length > 1) {
                  const tagName = window.location.hash.substring(2); // Remove the '#/'
                  console.log("Hash navigation: ", tagName);
                  
                  // Find and expand the tag
                  setTimeout(() => {
                    const tagElements = document.querySelectorAll('.opblock-tag');
                    tagElements.forEach(elem => {
                      const text = elem.textContent.trim();
                      if (text === tagName) {
                        if (!elem.classList.contains('is-open')) {
                          elem.click();
                        }
                      }
                    });
                  }, 300);
                }
              };
              
              // Handle initial load
              handleNavigation();
              
              // Also handle hash changes
              window.addEventListener('hashchange', handleNavigation);
            }
          });
          
          window.ui = ui;
        }
      </script>
    </body>
    </html>
    `);
  });

  app.get('/api-docs/section/:tag', (req, res) => {
    const tag = req.params.tag;
    res.redirect(`/api-docs#/${tag}`);
  });

  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
};

export { swaggerCdnDocs };
require('dotenv').config();
import './config/openapi';

import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { AuthController } from './controllers';
import { createServer } from '@dainqdev/rexpress';
import { AuthService } from './services';
import createPrismaClient from './db';

import { generateOpenApiDocs } from '@dainqdev/rexpress';

main();

function main() {
  const app = createServer();
  const db = createPrismaClient();

  db.$on('query', e => {
    console.log(`--------------------[QUERY CALL START]----------------\n`);
    console.log(`${e.query} ${e.params}\n`);
  });
  // Define service
  const authService = new AuthService(db);

  // Plugins
  app.use(express.json());

  // Controllers
  app.use(new AuthController(authService));

  //API docs

  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(generateOpenApiDocs()));

  app.listen(8080, () => {
    process.env.NODE_ENV !== 'production' &&
      console.log('Application running in http://localhost:8080');
  });
}

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z as zod } from 'zod';

extendZodWithOpenApi(zod);

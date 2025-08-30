import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const openapi = require('../docs/openapi.json');

const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(openapi));
export default router;



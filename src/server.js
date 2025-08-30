import app from './app.js';
import { connectMongo } from './config/mongo.js';
import { env } from './config/env.js';

async function main() {
  await connectMongo();
  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});



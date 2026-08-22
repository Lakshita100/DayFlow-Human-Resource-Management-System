import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const port = env.PORT;
    app.listen(port, () => {
      console.log(`🚀 Dayflow backend running on port ${port}`);
      console.log(`📋 Health check: http://localhost:${port}/api/health`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  const { disconnectDatabase } = await import('./config/database.js');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  const { disconnectDatabase } = await import('./config/database.js');
  await disconnectDatabase();
  process.exit(0);
});

startServer();

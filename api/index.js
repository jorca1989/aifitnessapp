import app from '../server/app.js';
import '../server/index.js'; // registers all routes on the shared app

// Export default for Vercel serverless function
export default app;


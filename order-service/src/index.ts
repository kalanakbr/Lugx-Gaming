import app from './app';
import { AppDataSource } from './data-source';

const PORT = process.env.PORT || 3003;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
    app.listen(PORT, () => {
      console.log(`🚀 Order service running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed', err);
  });

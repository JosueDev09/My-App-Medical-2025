import { testConnection } from './lib/db.js';

(async () => {
    await testConnection();
})();
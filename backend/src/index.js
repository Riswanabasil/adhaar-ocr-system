import { createServer } from 'http';
import app from './app.js';
import { PORT } from './config/index.js';

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

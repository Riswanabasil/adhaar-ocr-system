import { createServer } from 'http';
import app from './app';
import { PORT } from './config/index';

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

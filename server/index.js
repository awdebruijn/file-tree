import express, {json} from 'express';
import cors from 'cors';
import allItems from './all-items.js';

const PORT = 3000;
const server = express();
server.use(json());
server.use(cors())

server.get('/api/warehouse/all-items', (req, res) => {
  res.status(200).json(allItems);
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

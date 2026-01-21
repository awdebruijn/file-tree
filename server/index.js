import express, {json} from 'express';
import treeData from './tree-data.js';

const server = express();
server.use(json());

server.get('/', (req, res) => {
  res.status(200).json(treeData);
})

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

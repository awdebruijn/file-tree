import express, { json } from 'express';
import cors from 'cors';
import folderDataResponse from './folder-data.js';

const PORT = 3000;
const server = express();
server.use(json());
server.use(cors());

server.get('/api/warehouse/folder-data', (req, res) => {
  res.status(200).json(folderDataResponse);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

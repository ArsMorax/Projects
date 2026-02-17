import express from 'express';
import bodyParser from 'body-parser';

import productsRouter from './routes/product.js';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
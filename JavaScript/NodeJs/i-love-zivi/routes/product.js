import express from 'express'
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

let product = [
    { id: uuidv4(), name: 'ASUS Laptop Zenbook', price: 999.99, stock: 10 },
    { id: uuidv4(), name: 'Apple iPhone 13', price: 799.99, stock: 15 },
    { id: uuidv4(), name: 'Samsung Galaxy S21', price: 699.99, stock: 20 },
]

router.get('/', (req, res) => {
    res.json(product);
});

router.get('/:stock', (req, res) => {
    const stock = parseInt(req.params.stock, 10);
    const filteredProducts = product.filter(p => p.stock <= stock   );
    res.json(filteredProducts);
});

router.post('/', (req, res) => {

});

export default router;
import { Router } from 'express';
import fs from 'fs';

const productsRoutes = Router();

const getProducts = async () => {
    try {
        const products = await fs.promises.readFile('src/db/products.json', 'utf-8');
        const productsConverted = JSON.parse(products);
        return productsConverted;
    } catch (error) {
        return [];
    }
};

const saveProducts = async (products) => {
    try {
        const parsedProducts = JSON.stringify(products);
        await fs.promises.writeFile('src/db/products.json', parsedProducts, 'utf-8');
        return true;
    } catch (error) {
        return false;
    }
}

productsRoutes.get('/', async (req, res) => {
    const limit = +req.query.limit;
    const products = await getProducts();
    if(isNaN(limit) || !limit) {
        return res.send({products});
    }
    const productsLimited = products.slice(0, limit);
    res.send({products: productsLimited});
});

productsRoutes.get('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const products = await getProducts();
    const product = products.find(product => product.id === pId);
    if(!product) {
        return res.status(404).send({status: 'error', message: 'Producto no encontrado'});
    }
    res.send({product});
});


productsRoutes.post('/', async (req, res) => {
    const product = req.body;
    product.id = parseInt(Math.floor(Math.random() * 10000).toString() + Date.now().toString());
    if(!product.title || !product.description || !product.price || !product.code || !product.status || !product.stock || !product.category) {
        return res.status(400).send({status: 'error', message: 'Producto incompleto'});
    }
    const products = await getProducts();
    products.push(product);
    const isOk = await saveProducts(products);
    if(!isOk) {
        return res.send({status: 'error', message: 'Error al guardar el producto. No se pudo añadir el producto'});
    }
    res.send({status: 'success', message: 'Producto agregado'});
});

export default productsRoutes;
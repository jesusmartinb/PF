import { Router } from 'express';
import fs from 'fs';

const getProducts = async () => {
    try {
        const products = await fs.promises.readFile('src/db/products.json', 'utf-8');
        const productsConverted = JSON.parse(products);
        return productsConverted;
    } catch (error) {
        return [];
    }
}

const viewsRoutes = Router();

viewsRoutes.get('/', async (req, res) => {
    const products = await getProducts();
    res.render('home', { products, title: 'Home Listado de Productos', style: 'styles.css' });
});

viewsRoutes.get('/realtimeproducts', async (req, res) => {
    const products = await getProducts();
    res.render('realtimeproducts', { products, title: 'Realtime Products', style: 'styles.css' });
});

export default viewsRoutes;
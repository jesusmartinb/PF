import { Router } from 'express';
import fs from 'fs';

const cartRoutes = Router();

const getCarts = async () => {
    try {
        const carts = await fs.promises.readFile('src/db/carts.json', 'utf-8');
        const cartsConverted = JSON.parse(carts);
        return cartsConverted;
    } catch (error) {
        return [];
    }
};

const saveCarts = async (carts) => {
    try {
        const parsedCarts = JSON.stringify(carts);
        await fs.promises.writeFile('src/db/carts.json', parsedCarts, 'utf-8');
        return true;
    } catch (error) {
        return false;
    }
};

const getSingleCartById = async (cId) => {
    const carts = await getCarts();
    const cart = carts.find(cart => cart.id === cId);
    return cart;
};

cartRoutes.post('/', async (req, res) => {
    const products =  [];
    const cart = {};
    cart.id = parseInt(Math.floor(Math.random() * 10000).toString() + Date.now().toString());
    cart.products = products;
    if(!cart.products || !Array.isArray(cart.products)) {
        return res.status(400).send({status: 'error', message: 'Carrito vacío'});
    }
    const carts = await getCarts();
    carts.push(cart);
    const isOk = await saveCarts(carts);
    if(!isOk) {
        return res.send({status: 'error', message: 'Error al guardar el carrito'});
    }
    res.send({status: 'ok', message: 'Carrito recibido'});
});

cartRoutes.get('/:cid', async (req, res) => {
    const cId = +req.params.cid;
    const cart = await getSingleCartById(cId);
    if(!cart) {
        return res.status(404).send({status: 'error', message: 'Carrito no encontrado'});
    }
    res.send({cart});
});

cartRoutes.post('/:cid/product/:pid', async (req, res) => {
    const cId = +req.params.cid;
    const pId = +req.params.pid;
    const carts = await getCarts();
    const cart = carts.find(cart => cart.id === cId);
    if(!cart) {
        return res.status(404).send({status: 'error', message: 'Carrito no encontrado'});
    }
    const products = cart.products;
    const product = products.find(product => product.id === pId);
    if(!product) {
        products.push({id: pId, quantity: 1});
    } else {
        product.quantity++;
    }
    const isOk = await saveCarts(carts);
    if(!isOk) {
        return res.send({status: 'error', message: 'Error al guardar el carrito'});
    }
    res.send({status: 'ok', message: 'Producto añadido al carrito'});
});



export default cartRoutes;
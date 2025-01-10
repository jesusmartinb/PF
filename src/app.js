import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'node:http';
import { Server as ServerIo } from 'socket.io';
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js';

const PORT = 8080;

const app = express();
const httpServer = new HttpServer(app);
const io = new ServerIo(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

// middleware
const socketMidd = (io) => (req, res, next) => {
    req.io = io;
    next();
};

app.use('/', viewsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);

httpServer.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});

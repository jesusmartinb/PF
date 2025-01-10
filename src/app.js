import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);

const httpServer = app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});

const socketServer = new Server(httpServer);

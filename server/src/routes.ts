import express from 'express'; 
import {celebrate} from 'celebrate';

import UsersController from './controllers/UsersController';
import ProdutosController from './controllers/ProdutosController';
import SessionsController from './controllers/SessionsController';
import userSchema from './schemas/user.schema';
import isAuthenticated from './middlewares/isAuthenticated';
import ClientesController from './controllers/ClientesController';
import PedidosController from './controllers/PedidosController';
import userUpdate from './schemas/userUpdate.schema';
import StatusController from './controllers/StatusController';

// index , show, create , update, delete
const routes = express.Router();
const usersController = new UsersController();
const statusController = new StatusController();
const produtosController = new ProdutosController();
const sessionsController = new SessionsController();
const clientesController = new ClientesController();
const pedidosController = new PedidosController();


routes.post('/login', sessionsController.create);
routes.post('/send-email', sessionsController.sendEmail);


routes.get('/users', usersController.index);
routes.get('/statusPedido', statusController.index);
routes.post('/users', celebrate(userSchema,{abortEarly:false}), usersController.create);
routes.delete('/users/:id', usersController.delete);


routes.use(isAuthenticated);
routes.get('/produtos/:id', produtosController.index);
routes.get('/produtos/up/:id', produtosController.list);
routes.post('/produtos', produtosController.create);
routes.put('/users/:id',celebrate(userUpdate,{abortEarly:false}), usersController.update);
routes.put('/produtos/:id', produtosController.update);
routes.delete('/produtos/:id', produtosController.delete);

routes.get('/clientes/:id', clientesController.index);
routes.get('/clientes/up/:id', clientesController.list);
routes.post('/clientes', clientesController.create);
routes.put('/clientes/:id', clientesController.update);
routes.delete('/clientes/:id', clientesController.delete);


routes.get('/pedidos/:id', pedidosController.index);
routes.get('/pedidos/data/:id/:data1/:data2', pedidosController.pedidosData);
routes.get('/pedidosDados/:id/:data1/:data2', pedidosController.dashboardTotal);
routes.get('/pedidosGrafico/:id/:data1/:data2', pedidosController.dashboardGrafico);
routes.get('/pedidos/up/:id', pedidosController.list);
routes.post('/pedidos', pedidosController.create);
routes.put('/pedidos/:id', pedidosController.update);
routes.delete('/pedidos/:id', pedidosController.delete);


routes.get('forgot-password');
routes.get('password-reset');
routes.post('forgot-password');
routes.post('password-reset');

routes.get('/register');
routes.post('/register');

routes.get('/');
routes.put('/');
routes.delete('/');

export default routes;
import { Request , Response } from 'express';
import knex from '../database/connection';

class PedidosController{

    async index(request : Request, response : Response){
        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .join('pedidos', 'pedidos.user_id', '=', 'users.id')
        .join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
        .join('statusPedido', 'pedidos.status_id', '=', 'statusPedido.id')
        .join('produtos', 'pedidos.produto_id', '=', 'produtos.id').select("pedidos.*",
         knex.raw("DATE_FORMAT(pedidos.data_pedido, '%d/%m/%Y') as data_pedido"),
         "clientes.name as nameCliente",
        "produtos.name as nameProduto",
         knex.raw("(produtos.preco-pedidos.desconto+pedidos.frete) as precoProduto"),
         knex.raw("(produtos.preco-pedidos.desconto+pedidos.frete-produtos.custo) as lucro"),
        "statusPedido.name as nameStatus",
         "produtos.custo")
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);

    }

    async pedidosData(request : Request, response : Response){
        const {data1} = request.params;
        const {data2} = request.params;

        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .whereBetween('pedidos.created_at', [data1, data2])
        .join('pedidos', 'pedidos.user_id', '=', 'users.id')
        .join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
        .join('statusPedido', 'pedidos.status_id', '=', 'statusPedido.id')
        .join('produtos', 'pedidos.produto_id', '=', 'produtos.id').select("pedidos.*",
         knex.raw("DATE_FORMAT(pedidos.data_pedido, '%d/%m/%Y') as data_pedido"),
         "clientes.name as nameCliente",
        "produtos.name as nameProduto",
         knex.raw("(produtos.preco-pedidos.desconto) as precoProduto"),
         knex.raw("pedidos.frete as frete"),
         knex.raw("(produtos.preco-pedidos.desconto-produtos.custo) as lucro"),
        "statusPedido.name as nameStatus",
         "produtos.custo")
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);

    }


    async list(request : Request, response : Response){

        const result = await knex('pedidos')
        .where('id', request.params.id)
        .first();
        

        return response.json(result);
    }

    async dashboardTotal(request : Request, response : Response){

        const {data1} = request.params
        const {data2} = request.params
        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .whereBetween('pedidos.created_at', [data1, data2])
        .join('pedidos', 'pedidos.user_id', '=', 'users.id')
        .join('statusPedido', 'pedidos.status_id', '=', 'statusPedido.id')
        .join('produtos', 'pedidos.produto_id', '=', 'produtos.id').select("pedidos.*",
        knex.raw("SUM(produtos.preco - pedidos.desconto) as total"),
        knex.raw("SUM(produtos.preco - pedidos.desconto + pedidos.frete - pedidos.valor_pago) as receber"),
        knex.raw("SUM(produtos.preco - pedidos.desconto  - produtos.custo) as lucro "),
        knex.raw("SUM(produtos.preco - pedidos.desconto) - SUM(produtos.preco - pedidos.desconto + pedidos.frete -pedidos.valor_pago) as rebecido "))
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);
    }

    async dashboardGrafico(request : Request, response : Response){

        const {data1} = request.params;
        const {data2} = request.params;
        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .whereBetween('pedidos.created_at', [data1, data2])
        .join('pedidos', 'pedidos.user_id', '=', 'users.id')
        .groupByRaw('month(pedidos.created_at),year(pedidos.created_at)') 
        .join('statusPedido', 'pedidos.status_id', '=', 'statusPedido.id')
        .join('produtos', 'pedidos.produto_id', '=', 'produtos.id').select("pedidos.user_id",
        knex.raw("SUM(produtos.preco - pedidos.desconto  - produtos.custo) as lucro "),
        knex.raw("concat(month(pedidos.created_at),'/',year(pedidos.created_at)) as dataTotal"))
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);
    }

    async create (request : Request, response : Response){
        const {data_pedido, frete, desconto, obs, cliente_id, produto_id,valor_pago, status_id, user_id} = request.body

        await knex('pedidos').insert({
            data_pedido, frete, desconto, obs, cliente_id,valor_pago, produto_id,status_id, user_id
        })
        return response.status(201).send()

       
    }

    async update(request : Request, response : Response){
         const {data_pedido, frete, desconto, obs, cliente_id,valor_pago, produto_id, status_id, user_id} = request.body
         const {id} = request.params

 
         await knex('pedidos')
         .update({data_pedido, frete, desconto, obs, cliente_id,valor_pago, produto_id,status_id, user_id})
         .where({id})

         return response.send()
     }

    async delete(request : Request, response : Response){
         const {id} = request.params
         
         await knex('pedidos')
         .where({ id })
         .del()

         return response.send()
    }
}


export default PedidosController;
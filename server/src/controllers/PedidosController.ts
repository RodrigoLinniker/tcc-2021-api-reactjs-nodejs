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
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=','pedidos_produtos.produtos_id').select("pedidos.*",
         knex.raw("DATE_FORMAT(pedidos.data_pedido, '%d/%m/%Y') as data_pedido"),
         "clientes.name as nameCliente",
        "produtos.name as nameProduto",
         knex.raw("(SUM(produtos.preco-pedidos.desconto) + SUM(DISTINCT pedidos.frete)) as precoProduto"),
         knex.raw("(SUM(produtos.preco-pedidos.desconto-produtos.custo) + SUM(DISTINCT pedidos.frete)) as lucro"),
        "statusPedido.name as nameStatus",
         "produtos.custo")
         .groupByRaw('pedidos_id')
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);

    }

    async listPedidoPruduto(request : Request, response : Response){
        const resultIds = await knex('pedidos').select("produtos.name")
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id')
        .where('pedidos_id', request.params.id);

        const produtos_name = resultIds.map((produtos_id:number)=>{
            return produtos_id;
        })
        

        return response.json(produtos_name);

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
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id',  ).select("pedidos.*",
        knex.raw("DATE_FORMAT(pedidos.data_pedido, '%d/%m/%Y') as data_pedido"),
         "clientes.name as nameCliente",
        "produtos.name as nameProduto",
        knex.raw("SUM(produtos.custo) as custo"),
        knex.raw("SUM(produtos.preco-pedidos.desconto) as precoProduto"),
        knex.raw("pedidos.frete as frete"),
        knex.raw("SUM(produtos.preco-pedidos.desconto-produtos.custo) as lucro"),
        knex.raw("statusPedido.name as nameStatus"))
        .groupByRaw('pedidos_id')
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);

    }


   /*  async list(request : Request, response : Response){

        const resultIds = await knex('pedidos')
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id')
        .where('pedidos_id', request.params.id);

        const produtos_id = resultIds.map((item)=>item.produtos_id)

       
        const result = await knex('pedidos')
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id')
        .where('pedidos_id', request.params.id)
        .select("pedidos.*",
        knex.raw("produtos_id as id_produtos"))
        .first();
        

        return response.json({result,produtos_id});
    } */
    async list(request : Request, response : Response){

        const resultIds = await knex('pedidos')
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id')
        .where('pedidos_id', request.params.id);

        const produtos_id = resultIds.map((produtos_id:number)=>{
            return produtos_id;
        })
        
       
        const result = await knex('pedidos')
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id')
        .where('pedidos_id', request.params.id)
        .first();
        

        return response.json({result,produtos_id});
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
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id').select("pedidos.*",
        knex.raw("(SUM(produtos.preco - pedidos.desconto)+ SUM(DISTINCT pedidos.frete)) as total"),
        knex.raw("(SUM(produtos.preco - pedidos.desconto - produtos.custo) + SUM(distinct pedidos.frete)) as lucro "),
        knex.raw("((SUM(produtos.preco - pedidos.desconto) + SUM(DISTINCT pedidos.frete)) - SUM(distinct pedidos.valor_pago)) as receber"),
        knex.raw("((SUM(produtos.preco - pedidos.desconto) + SUM(DISTINCT pedidos.frete)) - (SUM(produtos.preco - pedidos.desconto - produtos.custo) + SUM(distinct pedidos.frete))) as despesas "))
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
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=', 'pedidos_produtos.produtos_id').select("pedidos.user_id",
        knex.raw("SUM(produtos.preco - pedidos.desconto  - produtos.custo) as lucro "),
        knex.raw("concat(month(pedidos.created_at),'/',year(pedidos.created_at)) as dataTotal"))
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);
    }

    async listPedidoCliente(request : Request, response : Response){
        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        const {idCliente} = request.params;
       

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .join('pedidos', 'pedidos.user_id', '=', 'users.id')
        .join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
        .join('statusPedido', 'pedidos.status_id', '=', 'statusPedido.id')
        .join('pedidos_produtos', 'pedidos_produtos.pedidos_id', '=', 'pedidos.id')
        .join('produtos', 'produtos.id', '=','pedidos_produtos.produtos_id',  ).select("pedidos.*",
         knex.raw("DATE_FORMAT(pedidos.data_pedido, '%d/%m/%Y') as data_pedido"),
         "clientes.name as nameCliente",
        "produtos.name as nameProduto",
         knex.raw("(produtos.preco-pedidos.desconto+pedidos.frete) as precoProduto"),
         knex.raw("(produtos.preco-pedidos.desconto+pedidos.frete-produtos.custo) as lucro"),
        "statusPedido.name as nameStatus",
         "produtos.custo")
        .where('cliente_id', idCliente)
        .groupByRaw('pedidos_id')
        .then(pedidos => pedidos.filter(pedidos=> pedidos.user_id === user.id));

        return response.json(result);

    }

    async create (request : Request, response : Response){
        const {data_pedido, frete, desconto, obs, cliente_id,valor_pago, status_id, user_id, produtos_id} = request.body;
       
        const trx = await knex.transaction();
        const insertedIds = await trx('pedidos').insert({
            data_pedido, frete, desconto, obs, cliente_id,valor_pago,status_id, user_id
        });

        const pedidos_id = insertedIds[0];
        const pointProdutos = produtos_id.map((produtos_id:number)=>{
            return{
                produtos_id,
                pedidos_id,
            }
        })

        await trx('pedidos_produtos').insert(pointProdutos);

        await trx.commit();

        return response.status(201).send()

       
    }

    async update(request : Request, response : Response){
         const {data_pedido, frete, desconto, obs, cliente_id,valor_pago,produtos_id, status_id, user_id} = request.body
         const {id} = request.params

        const trx = await knex.transaction();
        await trx('pedidos')
         .update({data_pedido, frete, desconto, obs, cliente_id,valor_pago,status_id, user_id})
         .where({id})

        const pedidos_id = parseInt(id);
         
       const pointProdutos =  produtos_id.map((produtos_id:number)=>{
           return{
               produtos_id,
               pedidos_id
           }
       })

       const pointsProdutos =  produtos_id.map((produtos_id:number)=>produtos_id);
       
      await trx('pedidos_produtos').where('pedidos_id',pedidos_id).del();
      await trx('pedidos_produtos').insert(pointProdutos).where("produtos_id", pointsProdutos);

       await trx.commit();
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
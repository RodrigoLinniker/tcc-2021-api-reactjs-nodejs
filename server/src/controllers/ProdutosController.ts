import { Request , Response } from 'express';
import knex from '../database/connection';

class ProdutosController{

    async index(request : Request, response : Response){

        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .join('produtos', 'produtos.user_id', '=', 'users.id').select("produtos.*")
        .then(produtos => produtos.filter(produtos=> produtos.user_id === user.id));

        return response.json(result);
    }

    async list(request : Request, response : Response){

        const result = await knex('produtos')
        .where('id', request.params.id)
        .first();
        

        return response.json(result);
    }

    async create (request : Request, response : Response){
        const {name, preco,custo, quantidade, user_id} = request.body

        await knex('produtos').insert({
            name , preco, custo, quantidade, user_id
        })
        return response.status(201).send()
    }

    async update(request : Request, response : Response){
         const {name, preco, custo, quantidade} = request.body
         const {id} = request.params
 
         await knex('produtos')
         .update({name, preco,custo, quantidade})
         .where({id})

         return response.send()
     }

    async delete(request : Request, response : Response){
         const {id} = request.params
         
         await knex('produtos')
         .where({ id })
         .del()

         return response.send();
    }
}


export default ProdutosController;
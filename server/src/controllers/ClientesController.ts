import { Request , Response } from 'express';
import knex from '../database/connection';

class ClientesController{

    async index(request : Request, response : Response){
        const user = await knex('users')
        .where('id', request.params.id)
        .first();

        if(!user) return response.status(400).json({message: 'Usuário não encontrado'});

        const result =await knex("users")
        .join('clientes', 'clientes.user_id', '=', 'users.id').select("clientes.*")
        .then(clientes => clientes.filter(clientes=> clientes.user_id === user.id));

        return response.json(result);
    }

    async list(request : Request, response : Response){

        const result = await knex('clientes')
        .where('id', request.params.id)
        .first();
        
        return response.json(result);
    }

    async create (request : Request, response : Response){
        const {name, telefone, email, user_id} = request.body

        await knex('clientes').insert({
            name , telefone, email, user_id
        })
        return response.status(201).send()

       
    }

    async update(request : Request, response : Response){
         const {name, telefone, email} = request.body
         const {id} = request.params
 
         await knex('clientes')
         .update({name, telefone, email})
         .where({id})

         return response.send()
     }

    async delete(request : Request, response : Response){
         const {id} = request.params
         
         await knex('clientes')
         .where({ id })
         .del()

         return response.send()
    }
}


export default ClientesController;
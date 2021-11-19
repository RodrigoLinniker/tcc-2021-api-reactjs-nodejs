import { Request , Response } from 'express';
import knex from '../database/connection';
import { hash } from 'bcryptjs';

class UsersController{

    async index(request : Request, response : Response){
        const users =await knex.select('id', 'name', 'email', 'cpf','telefone' , 'created_at', 'updated_at').from("users");

        return response.json(users);
    }

    async create (request : Request, response : Response){
    
        const {name, email, senha, remember, telefone, cpf} = request.body

        const userExist = await knex('users').where('email', email).first()
        const cpfExist = await knex('users').where('cpf', cpf).first()

        if(userExist){
            return response.status(400).json({message: 'Email já existe'})
        }

        if(senha != remember){
            return response.status(400).json({message: 'Senhas diferentes'})
        }

        if(cpfExist){
            return response.status(400).json({message: 'CPF já existe'})
        }

        const senhaHash = await hash(senha, 8);

        const user = {
            name, 
            email, 
            senha: senhaHash,
            remember: senhaHash,
            cpf,
            active: false, 
            telefone
        };
        
        const newIds = await knex('users').insert(user)

        return response.json({
            id: newIds[0],
            ...user
        });
    }

    async update(request : Request, response : Response){
        
         const {name, email, senha,telefone, cpf} = request.body
         const {id} = request.params
         const senhaHash = await hash(senha, 8);

        const userExist = await knex('users').where('id', {id}).first()
        const emailExist = await knex('users').where('email', email).first()

        
        if(email !== userExist.email){
            if(emailExist){
                return response.status(400).json({message: 'Email já existe'})
            }
        }
        
        await knex('users')
         .update({name, email,senha:senhaHash,telefone, cpf})
         .where({id})

         return response.json({
             id,
             name,
             email,
             telefone,
             cpf
         });
        }

    async delete(request : Request, response : Response){
       
         const {id} = request.params
         
         await knex('users')
         .where({ id })
         .del()

         return response.send()
    }
}


export default UsersController;
import { Request , Response } from 'express';
import knex from '../database/connection';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import * as nodemailer from 'nodemailer';


class SessionsController{

    async create (request : Request, response : Response){
       
        const {email, senha} = request.body
        
        const produto = await knex("produtos").join('users', 'produtos.user_id', '=', 'users.id').select('produtos.*').where('users.email', email);;

        const cliente = await knex("clientes").join('users', 'clientes.user_id', '=', 'users.id').select('clientes.*').where('users.email', email);

        const pedido = await knex("pedidos").join('users', 'pedidos.user_id', '=', 'users.id').select('pedidos.*').where('email',email);
        
        const user1 = await knex.select('*').from('users').where('email', email).first();
        const user = await knex.select('id', 'name', 'email', 'telefone', 'cpf').from('users').where('email', email).first()

        if(user){
            user.active = true;
        }

        if(!user){
            return response.status(400).json({message: 'Email ou senha não existe'})
        }

        const compareSenha = await compare(senha, user1.senha);

        if(!compareSenha){
            return response.status(400).json({message: 'Email ou senha não existe'})
        }

        const token = sign({}, authConfig.jwt.secret, {
            subject: String(user.id),
            expiresIn: authConfig.jwt.expireIn
        });

        return response.json({user, token, produto, cliente, pedido});

    }
}


export default SessionsController;
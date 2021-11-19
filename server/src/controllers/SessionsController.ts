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

    async sendEmail (request : Request, response : Response){
       
        const {email} = request.body
        
        const user1 = await knex('users').where('email', email).first();

        if(user1){
            const transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "420288f26b3744",
                    pass: "010473be400215"
                }
            })

            transporter.sendMail({
                from: 'Administrador <cc14f64dee-ff108c@inbox.mailtrap.io>',
                to: email,
                subject: 'Recuperação de Senha',
                html: `<p>Ola, sua senha nova para acessar o sistema é </p> </br> <a href="http://localhost:3000/verify-hash/"> Site </a>` 
            }).then(
                 () =>{
                    return response.status(200).json({message:'email enviado'})   
                }
            ).catch(()=>{
                return response.status(404).json({message:'email não enviado'});
            });
        }

    }
}


export default SessionsController;
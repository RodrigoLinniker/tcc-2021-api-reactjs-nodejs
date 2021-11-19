import { Request , Response } from 'express';
import knex from '../database/connection';

class StatusController{
    async index(request : Request, response : Response){

        const status1 = await knex('statusPedido');
      
        return response.json(status1);
    }
}

export default StatusController;

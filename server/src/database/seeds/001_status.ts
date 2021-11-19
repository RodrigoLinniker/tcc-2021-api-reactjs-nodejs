import Knex from 'knex';

export async function seed(knex : Knex){
   await knex('statusPedido').insert([
        { id: 1, name: 'A fazer' },
        { id: 2, name: 'Aprovado' },
        { id: 3, name: 'Entregue' }
    ]);
}
import Knex from 'knex';

export async function up(knex : Knex){
    //Criar tabela

    return knex.schema.createTable('pedidos_produtos', table =>{
        table.increments('id').primary();
        //relacionamento
        table.integer('pedidos_id').unsigned().references('pedidos.id').notNullable().onDelete('CASCADE');
        table.integer('produtos_id').unsigned().references('produtos.id').notNullable().onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex : Knex){
    //Voltar atras (deletar a tabela)
    return knex.schema.dropTable('pedidos_produtos');
}


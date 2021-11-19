import Knex from 'knex';

export async function up(knex : Knex){
    //Criar tabela

    return knex.schema.createTable('produtos', table =>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('preco').notNullable();
        table.string('custo').notNullable();
        table.integer('quantidade').notNullable();

        //relacionamento
        table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex : Knex){
    //Voltar atras (deletar a tabela)
    return knex.schema.dropTable('produtos');
}
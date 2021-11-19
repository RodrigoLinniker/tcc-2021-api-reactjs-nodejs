import Knex from 'knex';

export async function up(knex : Knex){
    //Criar tabela

    return knex.schema.createTable('users', table =>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('senha').notNullable();
        table.string('remember').notNullable();
        table.string('telefone').notNullable();
        table.string('cpf').notNullable();
        table.boolean('active');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex : Knex){
    //Voltar atras (deletar a tabela)
    return knex.schema.dropTable('users');
}
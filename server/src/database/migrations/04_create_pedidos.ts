import Knex from 'knex';

export async function up(knex : Knex){
    //Criar tabela

    return knex.schema.createTable('pedidos', table =>{
        table.increments('id').primary();
        table.date('data_pedido').notNullable();
        table.string('frete').notNullable();
        table.string('desconto').notNullable();
        table.string('obs').notNullable();
        table.string('valor_pago').notNullable();

        //relacionamento
        table.integer('cliente_id').unsigned().references('clientes.id').notNullable().onDelete('CASCADE');
        table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE');
        table.integer('status_id').unsigned().references('statusPedido.id').notNullable().onDelete('CASCADE');
        
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex : Knex){
    //Voltar atras (deletar a tabela)
    return knex.schema.dropTable('pedidos');
}
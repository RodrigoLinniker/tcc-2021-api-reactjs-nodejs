import knex from 'knex';

const connection = knex({
    client: 'mysql2',
    connection: {
       host : 'localhost',
       user : 'root',
       password : '',
       database : 'db_tcc1'
     },
     useNullAsDefault: true
})


export default connection;
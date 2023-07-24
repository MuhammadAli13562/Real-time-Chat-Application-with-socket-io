const {Pool} = require('pg')

const ClientProps = {
    host : 'localhost' ,
    port : 5432 ,
    database : 'mydb' ,
    user : 'postgres' ,
}

const pool = new Pool(ClientProps);

async function queryPostgres(query) {
    
  const client =  await pool.connect()
  const result =  await client.query(query)
  await client.release();
  return result;   
}

module.exports = {queryPostgres}
const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '261295.',
  database: 'joyas',
  allowExitOnIdle: true,
  port: 5432,
});


const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 0 }) => {
  
  const [columna, orden] = order_by.split("_");
  const offset = page * limits;


  const ordenamiento = orden.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  

  const consulta = format(
    "SELECT * FROM inventario ORDER BY %I %s LIMIT $1 OFFSET $2",
    columna,
    ordenamiento
  );
  const { rows: inventario } = await pool.query(consulta, [limits, offset]);
  const { rows: totalRows } = await pool.query("SELECT COUNT(*) FROM inventario");
  const total = totalRows[0].count;

  return {
    total: total, 
    results: inventario
  };
};

module.exports = { obtenerJoyas };

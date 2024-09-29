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

  const { columna, orden } = order_by.split("_");
  const offset = page * limits;

  
  let consulta = format(
    "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
    columna,
    orden,
    limits,
    offset
  );

  const { rows: inventario } = await pool.query(consulta);
  return { total: 100, results: inventario };
};


const obtenerJoyasFiltro = async ({ precio_max, precio_min, categoria, metal }) => {
  let filtros = [];
  const values = [];


  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };

  
  if (precio_max) agregarFiltro('precio', '<=', precio_max);
  if (precio_min) agregarFiltro('precio', '>=', precio_min);
  if (categoria) agregarFiltro('categoria', '=', categoria);
  if (metal) agregarFiltro('metal', '=', metal);


  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }

  const { rows: inventario } = await pool.query(consulta, values);
  return inventario;
};

module.exports = { obtenerJoyas, obtenerJoyasFiltro };


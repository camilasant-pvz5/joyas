const express = require('express');
const {obtenerJoyas, obtenerJoyasFiltro, prepararHateoas} = require('./consulta');
const format = require('pg-format');
const app = express();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.get('/joyas', async (req, res) => { 
try {
    const queryStrings = req.query;
    const { results: inventario } = await obtenerJoyas(queryStrings); 
    const HATEOAS = await prepararHateoas(inventario);
    res.json({ inventario, HATEOAS });
    
} catch (error) {
    console.error("Error al obtener las joyas:", error);
    res.status(500).json({ error: "Error al obtener las joyas" });
}}
);

app.get("/inventario/filtros", async (req, res) => {
    try {
      const queryStrings = req.query;
      const inventario = await obtenerJoyasFiltro(queryStrings);
      res.json(inventario);
    } catch (error) {
      console.error("Error al obtener las joyas:", error);
      res.status(500).json({ error: "Error al obtener las joyas" });
    }
  });




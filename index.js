const express = require('express');
const { obtenerJoyas } = require('./consultas');

const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});
/// 
app.get('/joyas', async (req, res) => {
    try {
        const queryStrings = req.query;
        const inventario = await obtenerJoyas(queryStrings);
        res.json(inventario); 
    } catch (error) {
        console.error("Error al obtener las joyas:", error);
        res.status(500).json({ error: "Error al obtener las joyas" });
    }
});


app.get('/joyas/filtros', async (req, res) => {
    try {
        const { precio_min, precio_max, categoria, metal } = req.query;

  
        const condiciones = [];
        const valores = [];

        if (precio_min) {
            condiciones.push(`precio >= $${valores.length + 1}`);
            valores.push(precio_min);
        }
        if (precio_max) {
            condiciones.push(`precio <= $${valores.length + 1}`);
            valores.push(precio_max);
        }
        if (categoria) {
            condiciones.push(`categoria = $${valores.length + 1}`);
            valores.push(categoria);
        }
        if (metal) {
            condiciones.push(`metal = $${valores.length + 1}`);
            valores.push(metal);
        }

        const consulta = `SELECT * FROM inventario ${condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : ''}`;
        const { rows: joyasFiltradas } = await pool.query(consulta, valores);
        
        res.json({ total: joyasFiltradas.length, results: joyasFiltradas });
    } catch (error) {
        console.error("Error al filtrar las joyas:", error);
        res.status(500).json({ error: "Error al filtrar las joyas" });
    }
});


app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

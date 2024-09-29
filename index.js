
const express = require('express');
const { obtenerJoyas } = require('./consultas');

const app = express();


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


app.get('/inventario/filtros', async (req, res) => {
    try {
        const queryStrings = req.query;
        const inventario = await obtenerJoyasFiltro(queryStrings);
        res.json(inventario); 
    } catch (error) {
        console.error("Error al obtener las joyas:", error);
        res.status(500).json({ error: "Error al obtener las joyas" });
    }
});

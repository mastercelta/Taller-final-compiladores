const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde 'compilador-grupo5/frontend'
app.use(express.static(path.join(__dirname, 'compilador-grupo5', 'frontend')));

// Ruta principal que devuelve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'compilador-grupo5', 'frontend', 'index.html'));
});
// Puerto de escucha para el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

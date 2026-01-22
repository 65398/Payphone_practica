const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos (HTML, JS, CSS)
app.use(express.static(__dirname));

// Ruta principal para el catálogo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Página de confirmación
app.get('/confirmacion.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'confirmacion.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
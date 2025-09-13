
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
// Permitir imágenes desde localhost:4000 y data: en CSP
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' http://localhost:4000 data:;");
  next();
});

// Servir imágenes estáticas desde la carpeta 'uploads' (ajusta si usas otra carpeta)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('🚀 Backend funcionando');
});

// Rutas de items
app.use('/api/items', require('./routes/item'));
// Rutas de proveedores
app.use('/api/suppliers', require('./routes/supplier'));
// Rutas de proyectos
app.use('/api/projects', require('./routes/project'));
// Rutas de consumibles
app.use('/api/consumibles', require('./routes/consumible'));
// Rutas de transacciones
app.use('/api/transactions', require('./routes/transaction'));

// Rutas de stock
app.use('/api/stock', require('./routes/stock'));
// Rutas de tienda virtual
app.use('/api/store', require('./routes/store'));

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});

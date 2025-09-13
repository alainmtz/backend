require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;


// Automatización de reportes financieros
require('./services/reportScheduler');

// Documentación Swagger
require('../swaggerold1')(app);


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
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


const permissions = require('./middlewares/permissions');

// Rutas protegidas con permisos granulares
app.use('/api/users', permissions, require('./routes/user'));
app.use('/api/items', permissions, require('./routes/item'));
app.use('/api/suppliers', permissions, require('./routes/supplier'));
app.use('/api/projects', permissions, require('./routes/project'));
app.use('/api/consumibles', permissions, require('./routes/consumible'));
app.use('/api/transactions', permissions, require('./routes/transaction'));
app.use('/api/stock', permissions, require('./routes/stock'));
app.use('/api/store', permissions, require('./routes/store'));
app.use('/api/finances', permissions, require('./routes/finance'));
app.use('/api/notifications', permissions, require('./routes/notification'));
app.use('/api/reports', permissions, require('./routes/report'));

// Rutas de autenticación (sin permisos)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// Rutas de recuperación de contraseña
app.use('/api/password', require('./routes/password'));



// Middleware global de errores avanzado
app.use((err, req, res, next) => {
  console.error(err);
  let status = 500;
  let type = 'internal';
  if (err.name === 'ValidationError') status = 400;
  if (err.name === 'AuthError') status = 401;
  if (err.name === 'NotFoundError') status = 404;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
    type: err.type || type,
    details: err.details || null
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});

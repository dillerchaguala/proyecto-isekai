// server.js
require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const connectDB = require('./config/db'); // Importa la función de conexión a la DB
const cors = require('cors'); // Importa el middleware CORS

// Importa tu manejador de errores personalizado
const { errorConverter, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- Conectar a la base de datos MongoDB ---
connectDB();

// --- Middlewares Globales ---
// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Middleware para CORS
// Esto permitirá que tu frontend se comunique con este backend
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://tu-dominio-frontend.com' : 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Importante si manejas cookies o credenciales de sesión
    optionsSuccessStatus: 204 // Para algunas solicitudes pre-vuelo (preflight requests)
}));

// --- Rutas de la API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/terapias', require('./routes/terapias'));
app.use('/api/logros', require('./routes/logros'));
app.use('/api/desafios', require('./routes/desafio')); // CAMBIO: 'Desafio' a 'desafios'
app.use('/api/estado-animo', require('./routes/estadoAnimo'));

// --- Ruta de prueba simple ---
app.get('/', (req, res) => {
    res.send('API de Isekai está corriendo...');
});

// --- Manejo de errores ---
// Captura cualquier ruta no definida (404 Not Found)
app.all('*', (req, res, next) => {
    next(new errorConverter(`No se encontró la ruta: ${req.originalUrl}`, 404));
});

// Middleware para convertir errores (si usas una clase de error personalizada para AppError)
app.use(errorConverter);

// Middleware centralizado de manejo de errores
app.use(errorHandler);

// --- Configuración y arranque del servidor ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
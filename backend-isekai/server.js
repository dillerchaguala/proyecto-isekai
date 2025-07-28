// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB(); // Conectar a la base de datos MongoDB

app.use(express.json());

// Middleware para CORS
// Esto permitirá que tu frontend (en localhost:5173) se comunique con este backend
app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes solo desde la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Si vas a manejar cookies o credenciales (importante para sesiones, por ejemplo)
    optionsSuccessStatus: 204 // Para algunas solicitudes pre-vuelo (preflight requests)
}));


// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/terapias', require('./routes/terapias'));
app.use('/api/logros', require('./routes/logros'));
app.use('/api/Desafio', require('./routes/desafio'));
app.use('/api/estado-animo', require('./routes/estadoAnimo'));

app.get('/', (req, res) => {
    res.send('API de Isekai está corriendo...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
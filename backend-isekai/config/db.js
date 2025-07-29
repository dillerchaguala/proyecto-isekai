// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Asegúrate de que process.env.MONGODB_URI esté definido en tu .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Salir del proceso con fallo
    }
};

module.exports = connectDB;
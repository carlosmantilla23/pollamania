const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Para manejar peticiones JSON

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/pollasdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error conectando a MongoDB:', err);
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Iniciar el servidor
const PORT = 3000;
const routes = require('./routes');
app.use(routes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

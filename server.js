const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const meetingController = require('./controllers/meetingController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API REST
app.post('/api/meetings', meetingController.createMeeting);
app.get('/api/meetings', meetingController.getMeetings);
app.post('/api/meetings/:id/summary', meetingController.generateSummaryForMeeting);

// Iniciar base de datos y servidor
sequelize.sync({ force: false }) // force: false asegura no borrar las tablas existentes
    .then(() => {
        console.log('Base de datos conectada y sincronizada.');
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });

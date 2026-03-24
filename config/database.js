const { Sequelize } = require('sequelize');

// Verifica que tengas creada la base de datos 'meeting_minutes_db' en MySQL
const sequelize = new Sequelize('meeting_minutes_db', 'root', 'alfi', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Desactiva el logging de SQL si prefieres la consola limpia
});

module.exports = sequelize;

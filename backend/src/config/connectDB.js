const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('online-shopping-websites', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!!!');
    } catch (error) {
        console.log('Unable to connect to database:', error);
    }
}

module.exports = connectDB;
const db = require('../config/db');

const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS expert (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(255),
            gender VARCHAR(255),
            address VARCHAR(255),
            birthdate DATE,
            role VARCHAR(255),
            profile_picture VARCHAR(255),
            ocupation VARCHAR(255),
            experiencie INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
  
    try {
        await db.query(query);
        console.log('Tabla expert verificada o creada correctamente');
    } catch (error) {
        console.error('Error al verificar/crear la tabla expert:', error);
    }
};
  
createUserTable();

const ExpertModel = {
    getAllExperts: () => {
        return db.query('SELECT * FROM expert');
    },
    getExpertById: (id) => {
        return db.query('SELECT * FROM expert WHERE id = ?', [id]);
    },
    createExpert: (expertData) => {
        return db.query('INSERT INTO expert SET ?', expertData);
    },
    updateExpert: (id, expertData) => {
        return db.query('UPDATE expert SET ? WHERE id = ?', [expertData, id]);
    },
    deleteExpert: (id) => {
        return db.query('DELETE FROM expert WHERE id = ?', [id]);
    },
    searchExperts: (term) => {
        return db.query('SELECT * FROM expert WHERE name LIKE ? OR expertise LIKE ?', [`%${term}%`, `%${term}%`]);
    }
};

module.exports = ExpertModel;
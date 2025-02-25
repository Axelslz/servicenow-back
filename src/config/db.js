const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',       
  user: 'root',            
  password: '',            
  database: 'back-servicenow',  
  port: 3306              
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    throw err; 
  }
  console.log('Connected to the database');
});

module.exports = connection;
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const userRoutes = require('./routes/userRoutes');
const expertRoutes = require('./routes/expertRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api', expertRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

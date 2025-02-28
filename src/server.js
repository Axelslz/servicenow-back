require('dotenv').config();
const express = require('express');
const cors = require('cors');


const authRoutes = require('./routes/userRoutes');
const expertRoutes = require('./routes/expertRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', expertRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

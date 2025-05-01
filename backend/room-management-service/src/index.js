require('dotenv').config();
const express = require('express');
const app = express();
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api/rooms', roomRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Room Management Service is running on port ${PORT}`);
});
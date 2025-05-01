require('dotenv').config();
const express = require('express');
const app = express();
const serviceRoutes = require('./routes/serviceRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api/services', serviceRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Management Service is running on port ${PORT}`);
});
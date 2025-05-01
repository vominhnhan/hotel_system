require('dotenv').config();
const express = require('express');
const app = express();
const bookingRoutes = require('./routes/bookingRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api/bookings', bookingRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Booking Service is running on port ${PORT}`);
});
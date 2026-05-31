require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

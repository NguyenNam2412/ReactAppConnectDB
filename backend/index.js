const express = require('express');
const app = express();
const cors = require('cors'); // important Access-Control-Allow-Origin
require('dotenv').config();

// Allow requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Alternatively, allow requests from any origin (use with caution)
// app.use(cors());

const queryRouter = require('./routes/query');

app.use(express.json());
app.use('/api', queryRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});

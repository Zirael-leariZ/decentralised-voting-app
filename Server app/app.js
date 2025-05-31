require('dotenv').config();
require('express-async-errors');
require('./utilities/cronTerminateVote');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const auth = require('./middleware/auth');

const userRouter = require('./routes/userRouter');
const voteRouter = require('./routes/voteRouter');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('<h1>Decentralised voting app</h1>');
});

// Protected route example (verifies JWT)
app.get('/api/v1/users/verify', auth, (req, res) => {
  res.json({ valid: true });
});

// User routes
app.use('/api/v1/users', userRouter);

// Vote routes
app.use('/api/v1/votes', voteRouter);

// 404 handler
app.use(notFoundMiddleware);

// Error-handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();

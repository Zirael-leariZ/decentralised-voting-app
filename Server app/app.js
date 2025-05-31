require('dotenv').config();
require('express-async-errors');

const express = require('express');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const voteRouter = require('./routes/voteRouter');

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Decetralised voting app</h1>');
});
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/votes/', voteRouter);

// Handling error routes
app.use(notFoundMiddleware);
app.use(errorMiddleware);


const port = process.env.PORT || 4000;

const start = async () => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
 import userRouter from './routes/user.routes.js';
 import jobRouter from './routes/job.routes.js';
import applicationRouter from './routes/application.routes.js';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
// app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is running',
        success: true,
    });
});

app.use('/api/v1/user', userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

export default app;
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js'; 
import { errorHandler } from './middlewares/error.js';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import commentRoutes from './routes/comments.js';

connectDB(); 
const app = express();
const PORT = process.env.PORT || 3000;
const globalLimiter = rateLimit({ 
    windowMs: 60 * 1000,
    max: 100,
    message: JSON.stringify({ 
        error: "Too many requests, please try again later." 
    }),
    statusCode: 429 
});

app.use(globalLimiter); 
app.use(helmet()); 

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); 
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));

app.use(morgan('dev')); 
app.use(express.json()); 

app.get('/api/status', (req, res) => {
    res.json({ status: "ok", database: "connected", service: "recipes-api" });
});

app.use('/api/auth', authRoutes); 
app.use('/api/recipes', recipeRoutes); 
app.use('/api/recipes/:recipeId/comments', commentRoutes); 
app.use('/api/comments', commentRoutes); 
app.use((req, res, next) => {
    const error = new Error(`Route non trouvée: ${req.originalUrl}`);
    res.status(404);
    next(error); 
});
app.use(errorHandler); 
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
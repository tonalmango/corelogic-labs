const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const quoteRoutes = require('./routes/quoteRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./config/logger');

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// General rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Strict rate limiter for auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true
});

app.use('/api', limiter);

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whiteLabelAgency', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    logger.info('MongoDB connected successfully');
})
.catch(err => {
    logger.error('MongoDB connection error: ' + err.message);
    process.exit(1);
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'White-Label Agency API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close();
        process.exit(0);
    });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection: ' + err.message);
    process.exit(1);
});
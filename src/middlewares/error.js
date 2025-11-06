export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    if (process.env.NODE_ENV !== 'production') {
        console.error('--- Global Error Handler ---');
        console.error(`Status: ${statusCode}, Message: ${message}`);
        console.error(err.stack);
        console.error('----------------------------');
    }
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = `Ressource non trouvée avec l'ID: ${err.value}`;
        statusCode = 404;
    }
    if (err.name === 'ValidationError') {
    
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(', ');
        message = `${field} est déjà utilisé. Veuillez en choisir un autre.`;
        statusCode = 409;
    }
    if (message === 'Not allowed by CORS') {
        statusCode = 403;
    }
    res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
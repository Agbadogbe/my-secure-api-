import rateLimit from 'express-rate-limit';
const keyGeneratorIpFallback = rateLimit.keyGenerator;
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: JSON.stringify({ 
        error: "Trop de tentatives de connexion échouées. Veuillez réessayer après 15 minutes." 
    }),
    statusCode: 429, 
    standardHeaders: true, 
    legacyHeaders: false, 
    keyGenerator: keyGeneratorIpFallback, 
});
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.sub).select('-password');
            if (!user) {
                return res.status(401).json({ error: "Token invalide, utilisateur non trouvé." });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error(error.message);
            return res.status(401).json({ error: "Token invalide ou expiré." });
        }
    } else {
        return res.status(401).json({ error: "Accès non autorisé. Token manquant." });
    }
};
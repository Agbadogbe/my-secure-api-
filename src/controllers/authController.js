
import User from '../models/User.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { email, password, role } = req.body; 
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {   
            return res.status(409).json({ error: "Un utilisateur avec cet email existe déjà." }); 
        }
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            email,
            password: hashedPassword, 
            role: role === 'admin' ? 'admin' : 'user' 
        });
        await user.save();
        res.status(201).json({ 
            message: "Utilisateur enregistré avec succès.", 
            user: user 
        }); 
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "Erreur serveur lors de l'enregistrement." }); 
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password'); 
        if (!user) {
            return res.status(401).json({ error: "Identifiants invalides." }); 
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants invalides." }); 
        }
        const token = jwt.sign(
            { 
                sub: user._id, 
                role: user.role 
            },
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' } 
        );
        res.status(200).json({ 
            message: "Connexion réussie.",
            token: token 
        }); 
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Erreur serveur lors de la connexion." }); 
    }
};
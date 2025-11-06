import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js'; 

export const getCommentsByRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;        
        const recipeExists = await Recipe.findById(recipeId);
        if (!recipeExists) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }
        const comments = await Comment.find({ recipe: recipeId })
            .populate('author', 'email') 
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        console.error("Get Comments Error:", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des commentaires." });
    }
};

export const createComment = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { content, rating } = req.body;        
        const recipeExists = await Recipe.findById(recipeId);
        if (!recipeExists) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }
        const newComment = new Comment({
            content,
            rating,
            recipe: recipeId,
            author: req.user._id, 
        });
        const savedComment = await newComment.save();
        await savedComment.populate('author', 'email');
        res.status(201).json({ 
            message: "Commentaire créé avec succès.", 
            data: savedComment 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        console.error("Create Comment Error:", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la création du commentaire." });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Commentaire non trouvé." });
        }
        const isOwner = comment.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas autorisé à modifier ce commentaire." });
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId, 
            { 
                content: req.body.content || comment.content,
                rating: req.body.rating || comment.rating,
                updatedAt: Date.now() 
            },
            { new: true, runValidators: true }
        ).populate('author', 'email');

        res.status(200).json({ 
            message: "Commentaire mis à jour avec succès.", 
            data: updatedComment 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Commentaire non trouvé." });
        }
        const isOwner = comment.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas autorisé à supprimer ce commentaire." });
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(204).json({}); 
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la suppression." });
    }
};
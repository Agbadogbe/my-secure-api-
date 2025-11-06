import Recipe from '../models/Recipe.js';
import Comment from '../models/Comment.js';

export const getRecipes = async (req, res) => {
    try {    
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(100, Number(req.query.limit || 10));
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.difficulty) {
            filter.difficulty = req.query.difficulty;
        }
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        const totalRecipes = await Recipe.countDocuments(filter);
        const recipes = await Recipe.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('author', 'email role');
        res.status(200).json({
            status: "success",
            count: recipes.length,
            page,
            totalPages: Math.ceil(totalRecipes / limit),
            data: recipes,
        });
    } catch (error) {
        console.error("Get Recipes Error:", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des recettes." });
    }
};

export const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'email role');   
        if (!recipe) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }
        res.status(200).json({ status: "success", data: recipe });
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ error: "ID de recette invalide." });
        }
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe({
            ...req.body,
            author: req.user._id,
        });
        const savedRecipe = await newRecipe.save();
        res.status(201).json({ 
            message: "Recette créée avec succès.", 
            data: savedRecipe 
        });
    } catch (error) {
        console.error("Create Recipe Error:", error.message);
    
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur serveur lors de la création." });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }
        const isOwner = recipe.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {        
            return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas l'auteur de cette recette." });
        }
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        ).populate('author', 'email role');
        res.status(200).json({ 
            message: "Recette mise à jour avec succès.", 
            data: updatedRecipe 
        });
    } catch (error) {
        console.error("Update Recipe Error:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: "Recette non trouvée." });
        }
        const isOwner = recipe.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Accès refusé. Vous n'avez pas l'autorisation de supprimer cette recette." });
        }
        await Comment.deleteMany({ recipe: req.params.id });
        await Recipe.findByIdAndDelete(req.params.id);
        res.status(204).json({});
    } catch (error) {
        console.error("Delete Recipe Error:", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la suppression." });
    }
};
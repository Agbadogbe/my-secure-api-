import express from 'express';
import { 
    getRecipes, 
    getRecipe, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe 
} from '../controllers/recipeController.js';
import { protect } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';

const router = express.Router();
router.get('/', getRecipes);    
router.get('/:id', getRecipe);  
router.post('/', protect, createRecipe); 
router.patch('/:id', protect, updateRecipe); 
router.put('/:id', protect, updateRecipe); 
router.delete('/:id', protect, deleteRecipe);

export default router;
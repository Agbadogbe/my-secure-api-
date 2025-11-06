import express from 'express';
import { 
    getCommentsByRecipe, 
    createComment, 
    updateComment, 
    deleteComment 
} from '../controllers/commentController.js';
import { protect } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';

const router = express.Router({ mergeParams: true });

router.get('/', getCommentsByRecipe);
router.post('/', protect, createComment);
router.patch('/:commentId', protect, updateComment); 
router.put('/:commentId', protect, updateComment); 
router.delete('/:commentId', protect, deleteComment); 

export default router;
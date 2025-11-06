import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Facile', 'Moyen', 'Difficile'],
        default: 'Facile',
    },
    prepTime: {
        type: Number,
        required: true,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { 
    versionKey: false 
});
RecipeSchema.index({ title: 'text', description: 'text' }); 

export default mongoose.model('Recipe', RecipeSchema);
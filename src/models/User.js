import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    password: { 
        type: String,
        required: true,
    },
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {     
    versionKey: false, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
});

UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

export default mongoose.model('User', UserSchema);
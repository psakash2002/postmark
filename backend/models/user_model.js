import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: String,
    username: String,
    email: String,
    thumbnail: String
});

const User = mongoose.model('user', userSchema);

export default User;

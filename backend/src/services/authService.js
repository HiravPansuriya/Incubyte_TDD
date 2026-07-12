import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (userData) => {
    const { email, password } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const user = await User.create({ email, password });
    const token = generateToken(user._id, user.role);

    return { _id: user._id, email: user.email, role: user.role, token };
};

export const loginUser = async (userData) => {
    const { email, password } = userData;

    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = generateToken(user._id, user.role);

    return { _id: user._id, email: user.email, role: user.role, token };
};
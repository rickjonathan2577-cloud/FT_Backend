import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

export const createUser = async (username, email, password) => {
    const saltRounds = 10;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        }); 
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds); // In a real application, you should hash the password before storing it
        const newUser = await prisma.user.create({
            data: {
                name : username,
                email, 
                passwordHash : hashedPassword, // In a real application, make sure to hash the password before storing it
            },
            select : {
                id : true,
                name : true,
                email : true,
            }
        });
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user: newUser, token };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error
    }         
}

export const loginUser = async (email, password) => {
    try {
        const userExist = await prisma.user.findUnique({
            where: { 
                email 
            },
        });
        if (!userExist) {
            throw new Error('User does not exist');
        }   
        const isPasswordValid = await bcrypt.compare(password, userExist.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: userExist.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return {  user:
             {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
            },
                token 
             };
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error
    }
}

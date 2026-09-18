
import { loginUser, createUser } from '../services/auth.services.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {

        const { user, token } = await createUser(username, email, password);

        res.cookie('token', token, {
            httpOnly : true, 
            secure :  process.env.NODE_ENV === 'production',
            sameSite : 'lax',
            maxAge : 60 * 60 * 1000
        })

        res.status(201).json({
            status: 201,
            message: 'User registered successfully',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }

}



export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const {user, token } = await loginUser(email, password);
        res.cookie('token',token, {
            httpOnly : true , 
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'lax',
            maxAge : 60 * 60 * 1000 // 1 Hour 
        } )
        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

export const logout = async (req, res) => {
    

    res.clearCookie('token'); 
    
    res.status(200).json({
        status: 200,
        message: 'User logged out successfully',
    });

}

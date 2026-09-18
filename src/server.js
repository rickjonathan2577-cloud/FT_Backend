import app from './app.js';
import 'dotenv/config';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

startServer();

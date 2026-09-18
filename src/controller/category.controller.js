import { createCategory, deleteCategory, getAll, getCategoryByName} from '../services/Category.services.js';

export const create = async (req, res) => {
    const { name, type } = req.body;
    const userId = req.user.userId; // Assuming userId is available in the request object after authentication
    try {
        const existingCategory = await getCategoryByName(userId, name);
        console.log(existingCategory)
        if(existingCategory.length > 0) {
            return res.status(400).json({
                status: 400,
                message: 'Category already exists'
            });
        }

        const category = await createCategory(name, type, userId);  
        res.status(200).json({ 
            status: 200,
            message: 'Category created successfully',
            data:  { category } 
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

export const getCategory = async (req,res) => {
    const userId = req.user.userId
    try {
        const getCategory = await getAll(userId)
        res.status(200).json({
            status : 200,
            data : getCategory
        })
    } catch (error) {
        res.status(500).json({
            status : 500,
            message : error.message
        })
    }
}



export const deleted = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; 
    try {
        const deletedCategory = await deleteCategory(id, userId);
        console.log(deletedCategory)
        res.status(200).json({
            status: 200,
            message: 'Category deleted successfully',
            data:  deletedCategory 
        });     

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}
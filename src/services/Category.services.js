import { prisma } from '../config/db.js';

export const getAll = async (userId) => {
    try { 
        const getCategory = await prisma.category.findMany({
            where : { userId }, 
            select : { 
                id : true, 
                name : true, 
                type : true,

                _count : {
                    select : {
                        transactions : true
                    }
                }
            },
        });

        const formattedCategories = getCategory.map((cat) => ({
            id: cat.id,
            name: cat.name,
            type: cat.type,
            count: cat._count.transactions // Ekstrak langsung angkanya
        }));
        return formattedCategories;
    } catch (error) {
        throw error
    }
}

export const getCategoryByName = async (userId, name) => {
    try {
        return await prisma.category.findMany({
            where : { userId, name}, 
        });
    } catch (error) {
        throw error
    }

}


export const createCategory = async (name, type, userId) => {
        try {
            const category = await prisma.category.create({ 
                data: { name, 
                    type, 
                    userId } , 
                select : {
                    id : true,
                    name : true,
                    type : true,
                }
                
                });
            return category;
        } catch (error) {
            throw new Error('Error creating category');
        }
}

export const deleteCategory = async (id, userId) => {
    try {
        // Cukup gunakan deleteMany untuk menghapus kategorinya.
        // Relasi SetNull di schema akan otomatis mengubah categoryId di tabel transaksi menjadi null.
        const delCategory = await prisma.category.deleteMany({
            where: { 
                id: id, 
                userId : userId 
            }
        });
        
        if(delCategory.count === 0) {
            throw new Error('Category not found or you do not have permission to delete this category');
        }
        
        return delCategory;
    } catch (error) {
        throw error;
    }
}
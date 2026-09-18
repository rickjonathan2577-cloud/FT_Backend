import { prisma } from "../config/db.js";

export const getAllTransaction = async ( userId ) => {
    try {
        const getTransaction = await prisma.transaction.findMany({
            where : { userId : userId},
            orderBy: { date: 'desc' },
            // WAJIB DITAMBAH: Supaya frontend dapat object kategorinya (termasuk namanya)
            include: {
                category: {
                    select: { name: true, type: true }
                }
            }
        });

        // Mapping supaya bentuk JSON-nya persis seperti dummy data di frontend-mu
        const formattedTransactions = getTransaction.map(trx => ({
            id: trx.id,
            date: trx.date,
            description: trx.description,
            amount: trx.amount,
            type: trx.category ? trx.category.type : 'UNKNOWN', 
            category: trx.category ? trx.category.name : null, // Akan jadi null jika kategori dihapus
            categoryId: trx.categoryId
        }));

        return formattedTransactions;
    } catch (error) {
        throw error;
    }
}

export const createTransaction = async (amount, categoryId, description , userId, date) => {
    try {
        const IsValidCategory = await prisma.category.findFirst({
            where : {id : categoryId, userId : userId}
        });
        if(!IsValidCategory){
            throw new Error("Kategori tidak ditemukan atau bukan milikmu!");
        }
        const createTrans = await prisma.transaction.create({
            data : { 
                    amount,
                    categoryId,
                    description,
                    userId,
                    date : date ? new Date(date) : undefined,
            }
        });
        return createTrans;
    } catch (error) {
        throw error;
    }
}

export const UpdateTransaction = async (id, amount, categoryId, description , userId, date) => {
    try {
        const updateTrans = await prisma.transaction.updateMany({
            where : {
                id, 
                userId,
            }, 
            data : {
                amount, 
                categoryId,
                description,
                date: date ? new Date(date) : undefined
            }
        });
        if(updateTrans === 0){
            throw new Error("Transaksi tidak ditemukan atau gagal diubah");
        }
        return updateTrans;
    } catch (error) {
        throw error
    }
}


export const deleteTransaction = async (id, userId) => {
    try {

        const existingTrans = await prisma.transaction.findUnique({
            where : { id: id}
        })
        if (!existingTrans) {
            throw new Error("NOT_FOUND: Transaksi tidak ditemukan di sistem.");
        }
        if (existingTrans.userId !== userId) {
            // Catat log di terminal server agar admin tahu ada percobaan peretasan
            console.warn(`⚠️ ALARM KEAMANAN: User ${userId} mencoba menghapus transaksi ${id} milik orang lain!`);
            
            // Lempar error spesifik
            throw new Error("FORBIDDEN: Kamu tidak memiliki izin untuk menghapus transaksi ini.");
        }
        const deleteTrans = await prisma.transaction.delete({
            where : { id }
        });

        if(deleteTrans.count === 0){
            throw new Error("Transaksi tidak ditemukan atau gagal dihapus");
        }
    
        return deleteTrans
    } catch (error) {
        throw error
    }
}

export const getDashboardSummary = async (userId) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where : { userId },
            include : { category : true }
        });
        
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((trx) => {
            // WAJIB PAKAI TANDA TANYA (?): trx.category?.type
            // Kalau tidak, ini akan CRASH saat membaca transaksi yang kategorinya dihapus (null)
            if(trx.category?.type === 'INCOME'){
                totalIncome += trx.amount;
            } else if (trx.category?.type === 'EXPENSE') {
                totalExpense += trx.amount;
            }
        });

        const balance = totalIncome - totalExpense;
        return { 
            totalIncome, 
            totalExpense, 
            balance 
        };
    } catch (error) {
        throw error;
    }
}
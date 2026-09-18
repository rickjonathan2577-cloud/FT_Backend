import { getAllTransaction, createTransaction, UpdateTransaction, deleteTransaction, getDashboardSummary } from "../services/transaction.services.js";

export const getTrans = async (req, res) => {
    const userId = req.user.userId
    console.log(userId)

    try{ 
        const getAll = await getAllTransaction(userId);
        res.status(200).json({
            status : 200,
            data :  getAll 
        })
    } catch (error) {
         res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

export const createTrans = async (req, res) => {
    const {amount, categoryId, description , date} = req.body;
    const userId = req.user.userId;
    try {
        const getCreate = await createTransaction(amount, categoryId, description , userId, date);
        res.status(200).json({
            status : 200,
            message : 'transaction Saved', 
            data : getCreate
        })
    } catch (error) {
        res.status(500).json({
            status : 500,
            message : error.message
        })
    }
}

export const UpdateTrans = async (req, res) => {
    const {id} = req.params
    const {amount, categoryId, description , date} = req.body;
    const userId = req.user.userId;
    try {
        const getUpdate = await UpdateTransaction(id, amount, categoryId, description , userId, date);
        res.status(200).json({
            status : 200,
            message : 'Transaction Updated',
            data : getUpdate 
        })
    } catch (error) {
        res.status(500).json({
            status : 500,
            message : error.message
        })
    }
}

export const DeleteTrans = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; 
    try {
        await deleteTransaction(id, userId);
        res.status(200).json({
            status : 200,
            message : 'Transaction Deleted'
        })
    } catch (error) {

        if(error.message.includes("NOT_FOUND")){
            return res.status(404).json({
                status : 404 ,
                message : 'transaksi tidak ditemukan'
            })
        }
        if (error.message.includes("FORBIDDEN")) {
            return res.status(403).json({
                status: 403,
                message: "Akses ditolak! Ini bukan transaksimu."
            });
        }

        // Jika error lainnya (misal database mati)
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }

}

// Jangan lupa import getDashboardSummary di bagian atas file
export const getSummary = async (req, res) => {
    const userId = req.user.userId;
    
    try {
        const summary = await getDashboardSummary(userId);
        
        res.status(200).json({
            status: 200,
            message: "Dashboard summary retrieved successfully",
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}
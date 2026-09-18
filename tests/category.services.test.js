import { describe, it, expect , vi, beforeEach} from 'vitest';
import { createCategory, getAll } from '../src/services/Category.services.js';
import { prisma } from '../src/config/db.js';

// 1. MOCKING: Beritahu Vitest untuk memalsukan objek prisma
vi.mock('../src/config/db.js', () => ({
    prisma : {
        category : {
            create : vi.fn(),// Memalsukan fungsi create
            findMany : vi.fn(), // Memalsukan fungsi findMany
            deleteMany : vi.fn() // Memalsukan fungsi deleteMany
        }
    }
}));

describe('Category Service - getCategory', () => {

    //Setiap sebelum memulai lagi lakukan clear mock
    beforeEach(() => {
        vi.clearAllMocks()
    });

    it('It should return all the Category data based on user Id', async ()=> {
        // Buat Mock untuk data yang harus di return 
        const mockReturnedCategories = [
            {
                id: "cat-001",
                name: "Gaji",
                type: "INCOME"
            }, 
            {
                id: "cat-002",
                name: "Gaji",
                type: "INCOME"
            },
            {
                id: "cat-003",
                name: "Gaji",
                type: "INCOME"
            },
        ];
        //  kita perintahkan untuk mengembalikan mockReturnedCategories
        prisma.category.findMany.mockResolvedValue(mockReturnedCategories);

        const result = await getAll('user-999')

        expect(result).toEqual(mockReturnedCategories)

        console.log(result)

        expect(prisma.category.findMany).toHaveBeenCalledTimes(1);

        expect(prisma.category.findMany).toHaveBeenCalledWith({
            where : {
                userId : 'user-999'
            },
            select: {
                id: true,
                name: true,
                type: true
            }
        });

    });

    
    it('Seharusnya melemparkan error jika database gagal/bermasalah', async () => {
        // Arrange: Perintahkan robot Prisma untuk seolah-olah error
        prisma.category.findMany.mockRejectedValue(new Error('Database Down'));

        // Act & Assert: Pastikan fungsi kita melempar error kembali
        // Karena ini fungsi async yang melempar error, kita gunakan rejects.toThrow()
        await expect(getAll('user-999')).rejects.toThrow('Database Down');
    });

})

describe('Category Services - createCategory', () => {
    // Reset status robot (mock) sebelum setiap test dijalankan
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('It should return the category data upon successful saving', async() => {
        // --- ARRANGE (Persiapan) ---
        // Kita siapkan data palsu yang seolah-olah dikembalikan oleh database
        const mockReturnedCategory = {
            id: "cat-123",
            name: "Gaji",
            type: "INCOME"
        };
        // Kita perintahkan robot Prisma palsu: "kembalikan mockReturnedCategory"
        prisma.category.create.mockResolvedValue(mockReturnedCategory);

        // --- ACT (Eksekusi) ---
        // Panggil fungsi service benerannya
        const result = await createCategory('Gaji', 'INCOME', 'user-999');

        // --- ASSERT (Validasi/Pengecekan) ---
        // 1. Pastikan hasil dari fungsi sama dengan data palsu kita
        expect(result).toEqual(mockReturnedCategory);

        // 2. Pastikan database palsu benar-benar dipanggil tepat 1 kali
        expect(prisma.category.create).toHaveBeenCalledTimes(1);

        // 3. (Sangat Penting) Pastikan fungsi kita mengirim format data yang benar ke Prisma!
        expect(prisma.category.create).toHaveBeenCalledWith({
            data: { 
                name: 'Gaji', 
                type: 'INCOME', 
                userId: 'user-999' 
            },
            select: {
                id: true,
                name: true,
                type: true
            }
        });
        
    });

    it('Seharusnya melemparkan error jika database gagal/bermasalah', async () => {
        // Arrange: Perintahkan robot Prisma untuk seolah-olah error
        prisma.category.create.mockRejectedValue(new Error('Database Down'));

        // Act & Assert: Pastikan fungsi kita melempar error kembali
        // Karena ini fungsi async yang melempar error, kita gunakan rejects.toThrow()
        await expect(createCategory('Gaji', 'INCOME', 'user-999')).rejects.toThrow('Error creating category');
    });
});


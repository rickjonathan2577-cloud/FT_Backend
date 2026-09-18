import { describe, it, expect, vi, beforeEach } from 'vitest';
// 1. Import controller yang mau dites
import { create } from '../../src/controller/category.controller.js';
// 2. Import service untuk kita palsukan
import { createCategory } from '../../src/services/Category.services.js'; 

// 3. MOCKING SERVICE: Beritahu Vitest untuk memalsukan file service ini
vi.mock('../../src/services/Category.services.js');

describe('Category Controller - create', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // 4. MOCKING REQUEST (req): Pura-pura jadi data dari Postman & Middleware
        req = {
            body: { name: 'Makan Siang', type: 'EXPENSE' },
            user: { userId: 'user-123' }
        };

        // 5. MOCKING RESPONSE (res): Pura-pura jadi Express
        res = {
            // mockReturnThis() memungkinkan chaining seperti res.status(200).json(...)
            status: vi.fn().mockReturnThis(), 
            json: vi.fn()
        };
    });

    it('Seharusnya mengembalikan status 200 dan data saat kategori berhasil dibuat', async () => {
        // Arrange: Perintahkan service palsu seolah-olah berhasil
        const mockCategory = { id: 'cat-1', name: 'Makan Siang', type: 'EXPENSE' };
        createCategory.mockResolvedValue(mockCategory);

        // Act: Panggil controller-nya
        await create(req, res);

        // Assert: Pastikan controller bereaksi dengan benar
        // 1. Cek apakah service dipanggil dengan parameter yang benar (dari req.body & req.user)
        expect(createCategory).toHaveBeenCalledWith('Makan Siang', 'EXPENSE', 'user-123');
        
        // 2. Cek apakah status HTTP yang dikembalikan adalah 200
        expect(res.status).toHaveBeenCalledWith(200);
        
        // 3. Cek apakah format JSON yang dikirimkan ke client sudah sesuai
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            message: 'Category created successfully',
            data: { category: mockCategory }
        });
    });

    it('Seharusnya mengembalikan status 500 jika terjadi error di service', async () => {
        // Arrange: Perintahkan service palsu seolah-olah error
        createCategory.mockRejectedValue(new Error('Gagal menyimpan ke database'));

        // Act: Panggil controller
        await create(req, res);

        // Assert: Pastikan controller menangkap error di blok catch
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 500,
            message: 'Gagal menyimpan ke database'
        });
    });
});
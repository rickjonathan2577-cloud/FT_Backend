import { describe, it, expect } from 'vitest';                        
import request from 'supertest';
import app from '../src/app.js';

describe('Main Server Test (app.js)', () => {
    it('Should return status 200 and Server Healthy when hit get/' , async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('Server Healthy');
    });

    it('It should return a 404 when accessing a non-existent route.', async () => {
        const response = await request(app).get('/api/rute-ngasal');
        
        expect(response.status).toBe(404); // Secara default Express mengembalikan 404 untuk route yang tidak terdaftar
    });
})
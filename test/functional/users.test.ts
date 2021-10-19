import { Token } from '@src/auth/types/token.typs';
import usersDao from '@src/users/dao/users.dao';

describe('Users endpoints', () => {
    let token: Token;
    const headers = {
        Authorization: '',
    };

    beforeAll(async () => {
        await usersDao.User.deleteMany({});

        // create a user
        await global.testRequest.post('/users').send({
            email: 'johndoe@email.com',
            password: '123456',
        });
        const response = await global.testRequest.post('/login').send({
            email: 'johndoe@email.com',
            password: '123456',
        });
        token = response.body;
        headers.Authorization = `Bearer ${token.accessToken}`;
    });

    it('should allow a POST to /users', async () => {
        const response = await global.testRequest.post('/users').send({
            email: 'johndoe@email.com',
            password: '12345',
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            email: 'johndoe@email.com',
            permissionFlags: 1,
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: 0,
        });
    });
});

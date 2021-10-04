import usersDao from '@src/users/dao/users.dao';

describe('Users endpoints', () => {
    beforeAll(async () => {
        await usersDao.User.deleteMany({});
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

import usersDao from '@src/users/dao/users.dao';

describe('Authentication endpoints', () => {
    beforeAll(async () => {
        await usersDao.User.deleteMany({});

        await global.testRequest.post('/users').send({
            email: 'johndoe@email.com',
            password: '12345',
        });
    });

    describe('Login', () => {
        describe('auth validation middleware', () => {
            it('should allow a POST to /login and get a ERROR when password was not send', async () => {
                const response = await global.testRequest.post('/login').send({
                    email: 'johndoe@email.com',
                });

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errors: [
                        {
                            location: 'body',
                            msg: 'Invalid value',
                            param: 'password',
                        },
                    ],
                });
            });

            it('should allow a POST to /login and get a ERROR when email was not sent', async () => {
                const response = await global.testRequest.post('/login').send({
                    password: '12345',
                });

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errors: [
                        {
                            location: 'body',
                            msg: 'Invalid value',
                            param: 'email',
                        },
                    ],
                });
            });

            it('should allow a POST to /login and get a ERROR when email and password was not sent', async () => {
                const response = await global.testRequest
                    .post('/login')
                    .send({});

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errors: [
                        {
                            location: 'body',
                            msg: 'Invalid value',
                            param: 'email',
                        },
                        {
                            location: 'body',
                            msg: 'Invalid value',
                            param: 'password',
                        },
                    ],
                });
            });
        });

        describe('auth middleware', () => {
            it('should allow a POST to /login and verify a password if is not valid throw a ERROR', async () => {
                const response = await global.testRequest.post('/login').send({
                    email: 'johndoe@email.com',
                    password: 'abcde',
                });

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errors: [
                        {
                            location: 'verify user password',
                            msg: 'Invalid password',
                            param: 'password',
                        },
                    ],
                });
            });

            it('should allow a POST to /login and verify if a email is not valid and throw a ERROR', async () => {
                const response = await global.testRequest.post('/login').send({
                    email: 'abc@email.com',
                    password: '12345',
                });

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errors: [
                        {
                            location: 'verify user email',
                            msg: 'Invalid email',
                            param: 'email',
                        },
                    ],
                });
            });
        });

        describe('auth controller', () => {
            it('should allow a POST to /login and return a access token and refresh token', async () => {
                const response = await global.testRequest.post('/login').send({
                    email: 'johndoe@email.com',
                    password: '12345',
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String),
                });
            });
        });
    });
});

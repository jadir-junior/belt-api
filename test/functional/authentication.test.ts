import { User } from '@src/models/user';

describe('Authentication functional tests', () => {
    let authenticationUser: User;

    beforeEach(async () => {
        await User.deleteMany({});

        authenticationUser = {
            email: 'johndoe@email.com',
            name: 'John Doe',
            password: '1234',
        };
        await new User(authenticationUser).save();
    });

    it('should generate a token for a valid user', async () => {
        const response = await global.testRequest
            .post('/login')
            .send(authenticationUser);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({ token: expect.any(String) })
        );
    });
});

import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js"
import bcrypt from "bcrypt"

describe('POST /api/users',() => {

    afterEach(async() => {
        await removeTestUser()
    })

    it('should can register new user', async () => {
        const result = await supertest(web)
                .post('/api/users')
                .send({
                    username : "test",
                    password : "rahasia",
                    name : "test"
                })
                    
            expect(result.status).toBe(200)
            expect(result.body.data.username).toBe("test")
            expect(result.body.data.name).toBe("test")
            expect(result.body.data.password).toBeUndefined()
    });

    it('should can reject if request invalid', async () => {
        const result = await supertest(web)
                .post('/api/users')
                .send({
                    username : "",
                    password : "",
                    name : ""
                })

            logger.info(result.body)
                    
            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
    });

    it('should can reject if username alredy registered', async () => {
        let result = await supertest(web)
        .post('/api/users')
        .send({
            username : "test",
            password : "rahasia",
            name : "test"
        })
            
    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("test")
    expect(result.body.data.password).toBeUndefined()
        
        result = await supertest(web)
                .post('/api/users')
                .send({
                    username : "test",
                    password : "rahasia",
                    name : "test"
                })
          logger.info(result.body)          
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
    });

})

describe('POST /api/users/login',() => {
    beforeEach( async() => {
        await createTestUser();
    })

    afterEach( async() => {
        await removeTestUser();
    })

    it("should can login", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username : "test",
                password : "rahasia"
            })

        logger.info(`---------------------${result.body}`)

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
    })

    it("should can rejected login", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username : "",
                password : ""
            })

        logger.info(`---------------------${result.body}`)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    
    it("should can rejected login if password wrong", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username : "test",
                password : "salah"
            })

        logger.info(`+++++++++++++${result.body}`)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })

    it("should can rejected login if username wrong", async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username : "salah",
                password : "rahasia"
            })

        logger.info(`+++++++++++++${result.body}`)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe('GET /api/users/current', () => {
    beforeEach( async() => {
        await createTestUser();
    })

    afterEach( async() => {
        await removeTestUser();
    })

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('authorization','test')

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('test')
        expect(result.body.data.name).toBe('test')
    })

    it('should can reject get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('authorization','salah')

        logger.info(result.body)

        expect(result.status).toBe(401)
    })
})

describe('PATCH /api/users/current' , () => {
    beforeEach( async() => {
        await createTestUser();
    })

    afterEach( async() => {
        await removeTestUser();
    })  

    it('should can update user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('authorization','test')
            .send({
                name : 'fitri',
                password : 'mypassword'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test')
        expect(result.body.data.name).toBe('fitri')

        // const user = await getTestUser()
        // expect(await bcrypt.compare('mypassword',user.password)).toBe(true)
    })
})

describe('LOGOUT /api/users/logout',() => {
    beforeEach( async() => {
        await createTestUser();
    })

    afterEach( async() => {
        await removeTestUser();
    })

    it('should can logout', async () => {
        const result = await supertest(web)
                .delete('/api/users/logout')
                .set('authorization','test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK data was deleted")

        const user = await getTestUser()
        expect(user.token).toBeNull()
    })

    it('should can reject logout if token is invalid ', async () => {
        const result = await supertest(web)
                .delete('/api/users/logout')
                .set('authorization','salah')

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()

        const user = await getTestUser()
        expect(user.token).toBeDefined()
    })
})
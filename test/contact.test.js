import supertest from "supertest"
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeTestUser, removeaAllTestContacts } from "./test-util.js"
import { web } from "../src/application/web.js"


describe('POST /api/contacts',() => {
    beforeEach(async() => {
        await createTestUser()
    })

    afterEach(async() => {
        await removeaAllTestContacts()
        await removeTestUser()
    })

   it('should can create contact', async () => {
        const result = await supertest(web)
                .post('/api/contacts')
                .set('Authorization','test')
                .send({
                    first_name : 'test',
                    last_name : 'test',
                    email : 'test@pzn.com',
                    phone : '08512345678'
                })

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.phone).toBe('08512345678')

   })

   it('should can reject if request is not valid', async () => {
    const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization','test')
            .send({
                first_name : '',
                last_name : 'test',
                email : 'test.com',
                phone : '0851234567889347104913130931741346905101'
            })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()


})

})

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async() => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async() => {
        await removeaAllTestContacts()
        await removeTestUser()
    })

    it('should can get contact',async() => {

        const testContact = await getTestContact()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id)
            .set('Authorization','test')


        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testContact.id)
        expect(result.body.data.first_name).toBe(testContact.first_name)
        expect(result.body.data.last_name).toBe(testContact.last_name)
        expect(result.body.data.email).toBe(testContact.email)
        expect(result.body.data.phone).toBe(testContact.phone)

    })

    it('should return 404 if contactId is not found',async() => {

        const testContact = await getTestContact()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1)
            .set('Authorization','test')


        expect(result.status).toBe(404)
    })
})

describe('PUT /api/contacts/:contactId',() => {
    beforeEach(async() => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async() => {
        await removeaAllTestContacts()
        await removeTestUser()
    })

    it('should can update exiting contact', async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization','test')
            .send({
                first_name : 'ichwan',
                last_name : 'nursid',
                email : 'ichwan@gmail.com',
                phone : '085123456'
            })


        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testContact.id)
        expect(result.body.data.first_name).toBe('ichwan')
        expect(result.body.data.last_name).toBe('nursid')
        expect(result.body.data.email).toBe('ichwan@gmail.com')
        expect(result.body.data.phone).toBe('085123456')
    })

    it('should can rejected if request invalid', async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization','test')
            .send({
                first_name : 'ichwan',
                last_name : 'nursid',
                email : 'ichwan',
                phone : '0851234560931410509175931414907513123790142'
            })


        expect(result.status).toBe(400)
    })

})

describe('DELETE /api/users/:contactId', () => {

    beforeEach(async() => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async() => {
        await removeaAllTestContacts()
        await removeTestUser()
    })

    it('should can delete contact', async () => {
        let testContact = await getTestContact()

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id)
            .set('Authorization','test')

        expect(result.status).toBe(200)

        testContact = await getTestContact()
        expect(testContact).toBeNull();
    })

    it('should reject if contact is not found', async () => {
        let testContact = await getTestContact()

        const result = await supertest(web)
            .delete('/api/contacts/' + (testContact.id + 1))
            .set('Authorization','test')

        expect(result.status).toBe(404)
    })
})

describe('GET /api/contacts',() => {
    beforeEach(async() => {
        await createTestUser()
        await createManyTestContact()
    })

    afterEach(async() => {
        await removeaAllTestContacts()
        await removeTestUser()
    })

    it('should can search without parameter', async () => {
        const result = await supertest(web)
                .get('/api/contacts')
                .set('Authorization','test')


        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(10)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_items).toBe(15)        

    })


    it('should can search without parameter', async () => {
        const result = await supertest(web)
                .get('/api/contacts')
                .query(
                    {
                        page : 2
                    }
                )
                .set('Authorization','test')


        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(5)
        expect(result.body.paging.page).toBe(2)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_items).toBe(15)        

    })


    it('should can search using name', async () => {
        const result = await supertest(web)
                .get('/api/contacts')
                .query(
                    {
                        name : 'test1'
                    }
                )
                .set('Authorization','test')


        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_items).toBe(6)        

    })

    it('should can search using email', async () => {
        const result = await supertest(web)
                .get('/api/contacts')
                .query(
                    {
                        email : 'test11'
                    }
                )
                .set('Authorization','test')


        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(1)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_items).toBe(1)        

    })

    it('should can search using phone', async () => {
        const result = await supertest(web)
                .get('/api/contacts')
                .query(
                    {
                        phone : '085123456781'
                    }
                )
                .set('Authorization','test')


        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_items).toBe(6)        

    })
})
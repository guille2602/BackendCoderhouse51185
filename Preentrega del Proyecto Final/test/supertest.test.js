import chai from 'chai';
import supertest from 'supertest';
import { app } from '../src/app.js'
import cartsModel from '../src/dao/models/carts.model.js';
import usersModel from '../src/dao/models/user.model.js';

const expect = chai.expect;
const requester = supertest(app);

describe ('Test de ecommerce', () => {

    describe('Test de sessions', async () => {

        beforeEach( function(){
            this.timeout(10000)
        })

        it('El endpoint POST /api/sessions/register debe crear un usuario en la base de datos-*', async ()=>{

            const userMock = {
                    first_name: "Pablo",
                    last_name: "Perez",
                    email: "p.perez@gmail.com",
                    age: 32,
                    password: "123456",
            }
            const { statusCode, _body } = await requester.post('/api/sessions/register').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("sucess");
        })


        it('El endpoint POST /api/sessions/login debe loguear correctamente al usuario', async ()=>{
            
            const loginMock = {
                email:"p.perez@gmail.com",
                password:"123456"
            }
            const { statusCode } = await requester.post('/api/sessions/login').send(loginMock);
            expect(statusCode).to.be.equal(200);
        })

        it('El endpoint GET /api/sessions/current debe devolver un DTO del usuario sin datos sensibles', async ()=>{

            const loginMock = {
                email:"p.perez@gmail.com",
                password:"123456"
            }
            const loginResponse = await requester.post('/api/sessions/login').send(loginMock)
            const { _body } = await requester.get('/api/sessions/current').set('Cookie', loginResponse.headers['set-cookie'])
            expect( _body.payload.email).to.be.equal("p.perez@gmail.com");
            expect(_body.payload).not.have.property("password");
        })

        after(async function(){
            await usersModel.deleteOne({email:"p.perez@gmail.com"});
        })
    })

    describe('Test de products', async () => {

        let cookie;
        let testProductId;
        
        beforeEach( function(){
            this.timeout(10000)
        })

        before( async function () {
            const adminMock = {
                email:"adminCoder@coder.com",
                password:"adminCod3r123"
            }
            const loginResponse = await requester.post('/api/sessions/login').send(adminMock);
            cookie = loginResponse.headers['set-cookie']
        })
        
        it('El endpoint POST /api/products/ debe agregar un producto y rechazarlo si no se envían los datos completos', async ()=>{

            const productMock = {
                title:"Producto de prueba",
                description: "Descripción del producto",
                code: "TEST001",
                stock: 10,
                category: "Test",
                thumbnail: []
            }
            const failResponse = await requester.post('/api/products').send(productMock).set("Cookie", cookie)
            const sucessResponse = await requester.post('/api/products').send({...productMock, price: 99}).set("Cookie", cookie);
            expect(failResponse.statusCode).to.be.equal(400);
            expect(sucessResponse._body.description).to.be.equal("Sucess");
            testProductId = sucessResponse._body.payload._id
            expect(testProductId).to.be.ok;
        })

        it ('El endpoint PUT /api/products/:pid debe actualizar el precio de un producto y rechazar la modificación si no se envían los datos completos', async ()=>{

            const productMock = {
                title:"Producto de prueba",
                description: "Descripción del producto",
                code: "TEST001",
                price: 99,
                stock: 20,
                category: "Test",
                thumbnail: []
            }
            const { statusCode, _body } = await requester.put(`/api/products/${testProductId}`).send({...productMock, status: true}).set("Cookie", cookie);
            const badRequest = await requester.put(`/api/products/${testProductId}`).send(productMock).set("Cookie", cookie);
            expect(badRequest.statusCode).to.be.equal(400);
            expect( statusCode ).to.be.equal(200);
            expect( _body.payload.modifiedCount).to.be.equal(1);

        })

        it ('El endpoint DELETE /api/products/:pid debe eliminar el producto creado anteriormente', async ()=>{

            const { _body } = await requester.delete(`/api/products/${testProductId}`).set("Cookie", cookie);
            expect( _body.payload.deletedCount ).to.be.equal(1);

        })

    })

    describe('Test de carts', async () => {
        
        let cookie;
        const cid = "6485fa85bbc9cfc8533679e4";
        const pid = "64d985613a2a6a3f0b6956bf"

        before( async function () {
            const userMock = {
                email:"guille@mail.com",
                password:"123456"
            }
            const loginResponse = await requester.post('/api/sessions/login').send(userMock);
            cookie = loginResponse.headers['set-cookie']
            await requester.delete('/api/carts/${cid}').set("Cookie", cookie);
        })

        it ('El endpoint POST api/carts/:cid/products/:pid debe agregar un producto al carrito y rechazar un id inválido,' , async () => {

            const { _body } = await requester.post(`/api/carts/${cid}/products/${pid}`).set("Cookie", cookie);
            const failTest = await requester.post(`/api/carts/${cid}/products/64d985613a2a6a3f0b6956bc`).set("Cookie", cookie);
            expect(_body.payload.modifiedCount).to.be.equal(1);
            expect(failTest._body.status).not.to.be.equal("sucess");
        })

        it ('El endpoint PUT api/carts/:cid/products/:pid debe modificar la cantidad de un producto solo del dueño del carrito' , async () => {

            const { _body } = await requester.put(`/api/carts/${cid}/products/${pid}`).send({quantity:10}).set("Cookie", cookie);
            expect(_body.status).to.be.equal("Sucess");
            const anotherCart = "6495b2bd4a4f2cbe817e8a4c"
            const cart = await cartsModel.findOne({_id:cid});
            expect(cart.products[0].quantity).to.be.equal(10);
            const failResponse = await requester.put(`/api/carts/${anotherCart}/products/${pid}`).send({quantity:10}).set("Cookie", cookie);
            expect(failResponse.statusCode).to.be.equal(403);
        })

        it ('El endpoint POST api/carts/:cid/purchase/ debe devolver un número de ticket' , async () => {
            const { _body } = await requester.post(`/api/carts/${cid}/purchase`).set("Cookie", cookie);
            expect( _body.ticket ).to.have.property("code");
            expect( _body.ticket.code ).to.be.ok;
        })

    })
})
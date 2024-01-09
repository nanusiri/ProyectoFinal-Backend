import chai from "chai";
import supertest from "supertest";

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing", () => {
    describe("test de session", () => {
        it("Debe loguear correctamnte a un usuario que sea admin", async () => {
            const mockUser = {
                email: "nanu@mail.com",
                password: "1234"
            }

            const { statusCode, ok, _body } = await requester.post('/login').send(mockUser)
            expect(_body).to.have.property("result").to.have.property("role").to.be.equal("admin")
        })
    })
    describe("test de products", () => {
        it("El endpoint POST /api/products debe crear un producto si somos usuario premium o admin", async () => {
            const productoMock = {
                titulo: "Capsula",
                description: "Capsulas de 400mg vacias",
                code: 164793,
                price: 399,
                status: true,
                stock: 30000,
                category: "Farmacia"
            }

            const { statusCode, ok, _body } = await requester.post('/api/products').send(productoMock)
            console.log(statusCode)
            console.log(ok)
            console.log(_body) //me tira error por el middleware de autorizacion
        })
    })
    describe("test de carts", () => {
        it("Debe cambiar la cantidad de un producto en el carrito seleccionado", async () => {
            const quantityMock = {
                quantity: 4
            }

            const { statusCode, ok, _body } = await requester.put('/api/carts/6511ff22bc9fa62b2a275118/products/65010c928bd6c316cd34a75e').send(quantityMock)
            console.log(_body)
            expect(_body.payload).to.have.property("productos").that.is.an("array")

        })

    })
})
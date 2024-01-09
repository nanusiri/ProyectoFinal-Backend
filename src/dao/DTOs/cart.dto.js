export default class CartDTO {
    constructor(cart) {
        this.titularCarrito = cart.titular
        this.productos = cart.productos
    }
}
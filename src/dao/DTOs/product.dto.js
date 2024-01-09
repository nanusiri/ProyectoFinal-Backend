export default class ProductDTO {
    constructor(product) {
        this.productTitle = product.titulo
        this.productDescription = product.description
        this.productCode = product.code
        this.productPrice = product.price
        this.productStatus = product.status
        this.productStock = product.stock
        this.productCategory = product.category
        this.productOwner = product.owner
    }
}
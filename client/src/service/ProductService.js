export default class ProductService {
    async getProductsSmall() {
        const res = await fetch('/demo/data/products-small.json');
        const d = await res.json();
        return d.data;
    }

    async getProducts() {
        const res = await fetch('/demo/data/products.json');
        const d = await res.json();
        return d.data;
    }

    async getProductsWithOrdersSmall() {
        const res = await fetch('/demo/data/products-orders-small.json');
        const d = await res.json();
        return d.data;
    }
}
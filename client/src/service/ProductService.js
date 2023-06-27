export default class ProductService {
    async getProducts() {
        const res = await fetch(import.meta.env.VITE_API_URL + 'products');
        return await res.json();
    }
}
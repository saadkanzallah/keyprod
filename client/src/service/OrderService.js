export default class OrderService {
    async getOrders() {
        const res = await fetch(import.meta.env.VITE_API_URL + 'orders');
        return await res.json();
    }
    
    async getFullOrder(id) {
        const res = await fetch(import.meta.env.VITE_API_URL + 'orders/' + id);
        return await res.json();
    }
}
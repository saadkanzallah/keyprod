export default class ParcelService {
    async getFullParcel() {
        const res = await fetch(import.meta.env.VITE_API_URL + 'parcels');
        return await res.json();
    }
}
class ApiService {
    static async request(endpoint, options = {}) {
        const token = getCookie(API_CONFIG.COOKIE_NAME);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const response = await fetch(
            `${API_CONFIG.BASE_URL}${endpoint}`,
            { ...defaultOptions, ...options }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    }

    static async login(email, password) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    static async getPlaces() {
        return this.request('/places');
    }

    static async getPlaceDetails(placeId) {
        return this.request(`/places/${placeId}`);
    }

    static async getReviews(placeId) {
        return this.request(`/places/${placeId}/reviews`);
    }
}

export default ApiService;
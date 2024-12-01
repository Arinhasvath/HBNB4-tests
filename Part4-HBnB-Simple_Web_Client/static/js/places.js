let allPlaces = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie(API_CONFIG.COOKIE_NAME);
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    initializePlaces();
    setupPriceFilter();
});

async function initializePlaces() {
    try {
        const token = getCookie(API_CONFIG.COOKIE_NAME);
        const response = await fetch(`${API_CONFIG.BASE_URL}/places`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erreur lors du chargement des places');

        allPlaces = await response.json();
        displayPlaces(allPlaces);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('places-list').innerHTML = 
            '<div class="error-message">Erreur lors du chargement des hébergements</div>';
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    
    if (!places || places.length === 0) {
        placesList.innerHTML = '<div class="no-places">Aucun hébergement disponible</div>';
        return;
    }

    placesList.innerHTML = places.map(place => `
        <article class="place-card" data-price="${place.price_by_night}">
            <img src="static/images/logo.png" alt="${place.name}" class="place-image">
            <div class="place-info">
                <h3>${place.name}</h3>
                <p class="price">${place.price_by_night}€ / nuit</p>
                <div class="amenities">
                    <span>${place.max_guest} voyageurs</span>
                    <span>${place.number_bathrooms} sdb</span>
                </div>
                <button onclick="window.location.href='place.html?id=${place.id}'" class="details-button">
                    Voir les détails
                </button>
            </div>
        </article>
    `).join('');
}

function setupPriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (e) => {
            const maxPrice = e.target.value;
            const filteredPlaces = maxPrice === 'all' 
                ? allPlaces 
                : allPlaces.filter(place => place.price_by_night <= parseInt(maxPrice));
            displayPlaces(filteredPlaces);
        });
    }
}
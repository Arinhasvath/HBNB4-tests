document.addEventListener('DOMContentLoaded', loadPlaceDetails);

async function loadPlaceDetails() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const placeId = new URLSearchParams(window.location.search).get('id');
    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/places/${placeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur de chargement');
        }

        const place = await response.json();
        displayPlaceDetails(place);
        loadReviews(placeId);
    } catch (error) {
        document.getElementById('place-details').innerHTML = 
            '<div class="error-message">Erreur lors du chargement des détails</div>';
    }
}

function displayPlaceDetails(place) {
    document.getElementById('place-details').innerHTML = `
        <div class="place-info">
            <h2>${place.name}</h2>
            <div class="amenities">
                <div class="amenity">
                    <img src="static/images/icon_bed.png" alt="voyageurs">
                    <span>${place.max_guest} voyageurs</span>
                </div>
                <div class="amenity">
                    <img src="static/images/icon_bath.png" alt="sdb">
                    <span>${place.number_bathrooms} sdb</span>
                </div>
                <div class="amenity">
                    <img src="static/images/icon_bed.png" alt="chambres">
                    <span>${place.number_rooms} chambres</span>
                </div>
            </div>
            <p class="description">${place.description || 'Pas de description disponible'}</p>
            <p class="price">${place.price_by_night}€ par nuit</p>
        </div>
    `;
}

async function loadReviews(placeId) {
    const token = localStorage.getItem('jwt_token');
    
    try {
        const response = await fetch(`${API_URL}/places/${placeId}/reviews`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const reviews = await response.json();
        displayReviews(reviews, placeId);
    } catch (error) {
        document.getElementById('reviews-container').innerHTML = 
            '<div class="error-message">Erreur lors du chargement des avis</div>';
    }
}

function displayReviews(reviews, placeId) {
    const container = document.getElementById('reviews-container');
    let content = '';

    if (reviews && reviews.length > 0) {
        content = reviews.map(review => `
            <div class="review-card">
                <p>${review.text}</p>
            </div>
        `).join('');
    } else {
        content = '<p>Aucun avis pour le moment</p>';
    }

    content += `
        <button onclick="window.location.href='add_review.html?place_id=${placeId}'" class="details-button">
            Ajouter un avis
        </button>
    `;

    container.innerHTML = content;
}

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie(API_CONFIG.COOKIE_NAME);
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    loadPlace();
});

async function loadPlace() {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    
    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const token = getCookie(API_CONFIG.COOKIE_NAME);
        const response = await fetch(`${API_CONFIG.BASE_URL}/places/${placeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load place details');

        const place = await response.json();
        displayPlaceDetails(place);
        loadReviews(placeId);
    } catch (error) {
        document.getElementById('place-details').innerHTML = 
            '<div class="error-message">Erreur lors du chargement des détails</div>';
    }
}

function displayPlaceDetails(place) {
    document.getElementById('place-details').innerHTML = `
        <div class="place-info">
            <h1>${place.name}</h1>
            <p class="price">${place.price_by_night}€ par nuit</p>
            <div class="amenities">
                <div class="amenity">${place.max_guest} voyageurs</div>
                <div class="amenity">${place.number_rooms} chambres</div>
                <div class="amenity">${place.number_bathrooms} salle(s) de bain</div>
            </div>
            <p class="description">${place.description || 'Aucune description disponible'}</p>
        </div>
    `;
}

async function loadReviews(placeId) {
    try {
        const token = getCookie(API_CONFIG.COOKIE_NAME);
        const response = await fetch(`${API_CONFIG.BASE_URL}/places/${placeId}/reviews`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        document.getElementById('reviews-list').innerHTML = 
            '<div class="error-message">Erreur lors du chargement des avis</div>';
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    
    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<p>Aucun avis pour le moment</p>';
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-text">${review.text}</div>
            <div class="review-date">${new Date(review.created_at).toLocaleDateString()}</div>
        </div>
    `).join('');
}
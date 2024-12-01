document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('review-form');
    if (form) {
        form.addEventListener('submit', submitReview);
    }
});

async function submitReview(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const placeId = new URLSearchParams(window.location.search).get('place_id');
    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    const text = document.getElementById('review-text').value;
    const errorElement = document.getElementById('error-message');

    if (!text.trim()) {
        errorElement.textContent = 'Le texte de l\'avis ne peut pas être vide';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (response.ok) {
            window.location.href = `place.html?id=${placeId}`;
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Erreur lors de l\'envoi de l\'avis');
        }
    } catch (error) {
        errorElement.textContent = error.message || 'Erreur lors de l\'envoi de l\'avis';
    }
}
class GalleryModal {
    constructor() {
        this.galleryButton = document.getElementById('gallery-button');
        this.galleryModal = document.getElementById('gallery-modal');
        this.galleryClose = document.querySelector('.gallery-modal-close');
        this.galleryCards = document.getElementById('gallery-cards');
        
        this.init();
    }

    init() {
        // Ensure modal is hidden on page load
        this.closeModal();
        
        // Load destinations and create cards
        this.loadDestinations().then(destinations => {
            this.createGalleryCards(destinations);
        });

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        if (this.galleryButton) {
            this.galleryButton.addEventListener('click', () => this.openModal());
        }
        
        if (this.galleryClose) {
            this.galleryClose.addEventListener('click', () => this.closeModal());
        }

        if (this.galleryModal) {
            // Close modal when clicking outside
            this.galleryModal.addEventListener('click', (e) => {
                if (e.target === this.galleryModal) {
                    this.closeModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.galleryModal && this.galleryModal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    async loadDestinations() {
        try {
            const response = await fetch('data/destination.json');
            const data = await response.json();
            return data.destinations;
        } catch (error) {
            console.error('Error loading destinations:', error);
            return [];
        }
    }

    createGalleryCards(destinations) {
        if (!this.galleryCards) return;
        
        this.galleryCards.innerHTML = '';
        
        destinations.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${destination.image}" alt="${destination.name}">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                <div class="card-stats">
                    <div class="card-stat">
                        <div class="card-stat-label">Distance</div>
                        <div class="card-stat-value">${destination.distance}</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-label">Travel Time</div>
                        <div class="card-stat-value">${destination.travelTime}</div>
                    </div>
                </div>
            `;
            
            // Add click event to select destination
            card.addEventListener('click', () => {
                this.selectDestination(destination.name);
                this.closeModal();
            });
            
            this.galleryCards.appendChild(card);
        });
    }

    selectDestination(destinationName) {
        const buttons = document.querySelectorAll('.destination-nav-button');
        buttons.forEach(button => {
            if (button.textContent.trim().toLowerCase() === destinationName.toLowerCase()) {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add active class to selected button
                button.classList.add('active');
                // Trigger click to update content
                button.click();
            }
        });
    }

    openModal() {
        if (this.galleryModal) {
            this.galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.galleryModal) {
            this.galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new GalleryModal();
});
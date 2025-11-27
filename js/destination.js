class DestinationCarousel {
  constructor() {
    this.buttons = document.querySelectorAll(".destination-nav-button");
    this.title = document.querySelector(".destination-text h2");
    this.description = document.querySelector(".destination-text p");
    this.image = document.querySelector(".destination-picture img");
    this.distance = document.querySelector(".destination-text-bottom-item:nth-child(1) .destination-text-bottom-item-text");
    this.travelTime = document.querySelector(".destination-text-bottom-item:nth-child(2) .destination-text-bottom-item-text");
    this.currentIndex = 0;
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch("data/destination.json");
      const jsonData = await response.json();
      this.data = jsonData.destinations;
    } catch (error) {
      console.error("Erreur lors du chargement des données destination:", error);
    }
  }

  updateContent(index) {
    if (!this.data || !this.data[index]) return;

    const destination = this.data[index];
    
    if (this.title) this.title.textContent = destination.name;
    if (this.description) this.description.textContent = destination.description;
    if (this.image) this.image.src = destination.image;
    if (this.distance) this.distance.textContent = destination.distance;
    if (this.travelTime) this.travelTime.textContent = destination.travelTime;

    this.updateButtons(index);
  }

  updateButtons(activeIndex) {
    this.buttons.forEach((button, index) => {
      if (index === activeIndex) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  init() {
    this.loadData().then(() => {
      if (this.data && this.data.length > 0) {
        this.updateContent(0);
        
        this.buttons.forEach((button, index) => {
          button.addEventListener("click", () => {
            this.currentIndex = index;
            this.updateContent(index);
          });
        });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DestinationCarousel().init();
});
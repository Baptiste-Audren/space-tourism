class CrewCarousel {
  constructor() {
    this.dots = document.querySelectorAll(".crew-dots img");
    this.role = document.querySelector(".crew-title-prefix");
    this.name = document.querySelector(".crew-text h3");
    this.bio = document.querySelector(".crew-text p.crew-description");
    this.image = document.querySelector(".crew-picture img");
    this.mobileSource = document.querySelector(".crew-picture source");
    this.currentIndex = 0;
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch("data/crew.json");
      const jsonData = await response.json();
      this.data = jsonData.crew;
    } catch (error) {
      console.error("Erreur lors du chargement des données crew:", error);
    }
  }

  updateContent(index) {
    if (!this.data || !this.data[index]) return;

    const crewMember = this.data[index];
    
    this.role.textContent = crewMember.role;
    this.name.textContent = crewMember.name;
    this.bio.textContent = crewMember.bio;
    this.image.src = crewMember.images.desktop;
    
    if (this.mobileSource) {
      this.mobileSource.srcset = crewMember.images.mobile;
    }

    this.updateDots(index);
  }

  updateDots(activeIndex) {
    this.dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.src = "img/point-blanc.svg";
      } else {
        dot.src = "img/point-gris.svg";
      }
    });
  }

  init() {
    this.loadData().then(() => {
      if (this.data && this.data.length > 0) {
        this.updateContent(0);
        
        this.dots.forEach((dot, index) => {
          dot.addEventListener("click", () => {
            this.currentIndex = index;
            this.updateContent(index);
          });
        });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CrewCarousel().init();
});
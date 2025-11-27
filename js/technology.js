class TechnologyCarousel {
  constructor() {
    this.tabs = document.querySelectorAll(".tab");
    this.name = document.querySelector(".text h3");
    this.description = document.querySelector(".text p");
    this.image = document.querySelector(".technology-content picture img");
    this.tabletSource = document.querySelector(".technology-content picture source");
    this.currentIndex = 0;
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch("data/technology.json");
      const jsonData = await response.json();
      this.data = jsonData.technology;
    } catch (error) {
      console.error("Erreur lors du chargement des données technology:", error);
    }
  }

  updateContent(index) {
    if (!this.data || !this.data[index]) return;

    const tech = this.data[index];
    
    this.name.textContent = tech.name;
    this.description.textContent = tech.description;
    this.image.src = tech.images.portrait;
    
    if (this.tabletSource) {
      this.tabletSource.srcset = tech.images.landscape;
    }

    this.updateTabs(index);
  }

  updateTabs(activeIndex) {
    this.tabs.forEach((tab, index) => {
      if (index === activeIndex) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }

  init() {
    this.loadData().then(() => {
      if (this.data && this.data.length > 0) {
        this.updateContent(0);
        
        this.tabs.forEach((tab, index) => {
          tab.addEventListener("click", () => {
            this.currentIndex = index;
            this.updateContent(index);
          });
        });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TechnologyCarousel().init();
});
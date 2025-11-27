const toggleMenu = document.querySelector('nav button');
const menu = document.querySelector('.nav-links');
const img = document.getElementById('burger-button-image');

toggleMenu.addEventListener('click', function () {
  const open = JSON.parse(toggleMenu.getAttribute('aria-expanded'));
  toggleMenu.setAttribute('aria-expanded', !open);
  console.log(menu)
  menu.hidden = !menu.hidden;
  img.src = open ? "../img/burger-1.png" : "../img/burger-2.svg";

  if (!menu.hidden) {
    menu.querySelector('a').focus();
  }
});
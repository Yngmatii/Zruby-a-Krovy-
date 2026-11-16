const searchForm = document.querySelector('#site-search');
const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchInput = searchForm.querySelector('input');
    if (searchInput) {
      searchInput.blur();
    }
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formNote) {
      formNote.textContent = 'Ďakujeme. Vaša správa bola zaznamenaná a radi sa vám ozveme.';
    }
    contactForm.reset();
  });
}

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

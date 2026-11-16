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
      formNote.textContent =
        'Formulár zatiaľ nie je napojený na odosielanie. Zavolajte nám alebo napíšte na uvedený e-mail.';
    }
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

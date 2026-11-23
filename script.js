const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
const messagesStorageKey = 'zruby_krovy_messages';
const messagesToggle = document.querySelector('#toggle-messages');
const messagesPanel = document.querySelector('#received-messages-panel');
const messagesList = document.querySelector('#messages-list');
const clearMessagesButton = document.querySelector('#clear-messages');

function getStoredMessages() {
  try {
    const storedMessages = JSON.parse(localStorage.getItem(messagesStorageKey) || '[]');
    return Array.isArray(storedMessages) ? storedMessages : [];
  } catch (error) {
    return [];
  }
}

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value == null ? '' : String(value);
  return element.innerHTML;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? String(timestamp) : date.toLocaleString('sk-SK');
}

function renderStoredMessages() {
  if (!messagesList) return;

  const messages = getStoredMessages();
  if (messages.length === 0) {
    messagesList.innerHTML = '<p class="messages-empty">Zatiaľ neboli prijaté žiadne správy.</p>';
    if (clearMessagesButton) clearMessagesButton.hidden = true;
    return;
  }

  if (clearMessagesButton) clearMessagesButton.hidden = false;
  messagesList.innerHTML = [...messages].reverse().map((message) => `
    <article class="message-card">
      <div class="message-meta">
        <h3>${escapeHtml(message.name)}</h3>
        <time>${escapeHtml(formatTimestamp(message.timestamp))}</time>
      </div>
      <dl>
        <div><dt>Email</dt><dd>${escapeHtml(message.email)}</dd></div>
        <div><dt>Telefón</dt><dd>${escapeHtml(message.phone)}</dd></div>
      </dl>
      <p class="message-text">${escapeHtml(message.message)}</p>
    </article>
  `).join('');
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = {
      name: contactForm.elements.name.value.trim(),
      email: contactForm.elements.email.value.trim(),
      phone: contactForm.elements.phone.value.trim(),
      message: contactForm.elements.message.value.trim(),
      timestamp: new Date().toISOString()
    };

    const messages = getStoredMessages();
    messages.push(message);
    localStorage.setItem(messagesStorageKey, JSON.stringify(messages));

    contactForm.reset();
    renderStoredMessages();

    if (formNote) {
      formNote.textContent = 'Správa bola úspešne odoslaná.';
      formNote.className = 'form-note form-success';
    }
  });
}

if (messagesToggle && messagesPanel) {
  messagesToggle.addEventListener('click', () => {
    const shouldOpen = messagesPanel.hidden;
    messagesPanel.hidden = !shouldOpen;
    messagesToggle.setAttribute('aria-expanded', String(shouldOpen));
    messagesToggle.textContent = shouldOpen ? 'Skryť prijaté správy' : 'Zobraziť prijaté správy';
    if (shouldOpen) renderStoredMessages();
  });
}

if (clearMessagesButton) {
  clearMessagesButton.addEventListener('click', () => {
    localStorage.removeItem(messagesStorageKey);
    renderStoredMessages();
  });
}

renderStoredMessages();

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    setTimeout(() => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
    }, 100);
  }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  document.querySelectorAll('[data-page-entrance]').forEach((hero) => {
    hero.classList.add('entrance-ready');
  });
}

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const motionItems = document.querySelectorAll([
    '.hero-badge',
    '.home-about',
    '.about-layout > *',
    '.service-card',
    '.wood-card',
    '.gallery-section',
    '.gallery-card',
    '.contact-info',
    '.contact-card',
    '.received-messages',
    '.table-scroll'
  ].join(', '));

  if (motionItems.length) {
    document.documentElement.classList.add('motion-enabled');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

    motionItems.forEach((item) => {
      item.classList.add('motion-item');
      observer.observe(item);
    });
  }
}

const imageLightbox = document.createElement('dialog');
imageLightbox.className = 'image-lightbox';
imageLightbox.setAttribute('aria-label', 'Zväčšený obrázok');

const enlargedImage = document.createElement('img');
const closeImageLightbox = document.createElement('button');
const previousImageButton = document.createElement('button');
const nextImageButton = document.createElement('button');
closeImageLightbox.className = 'image-lightbox-close';
closeImageLightbox.type = 'button';
closeImageLightbox.setAttribute('aria-label', 'Zatvoriť obrázok');
closeImageLightbox.textContent = '×';
previousImageButton.className = 'image-lightbox-nav image-lightbox-previous';
previousImageButton.type = 'button';
previousImageButton.setAttribute('aria-label', 'Predchádzajúca fotografia');
previousImageButton.textContent = '‹';
nextImageButton.className = 'image-lightbox-nav image-lightbox-next';
nextImageButton.type = 'button';
nextImageButton.setAttribute('aria-label', 'Nasledujúca fotografia');
nextImageButton.textContent = '›';
imageLightbox.append(closeImageLightbox, previousImageButton, enlargedImage, nextImageButton);
document.body.append(imageLightbox);

let galleryImages = [];
let currentGalleryImageIndex = -1;

function openImageLightbox(image) {
  const gallerySection = image.closest('.gallery-section');
  galleryImages = gallerySection ? [...document.querySelectorAll('.gallery-section .gallery-card img')] : [];
  currentGalleryImageIndex = galleryImages.indexOf(image);
  const hasGalleryNavigation = currentGalleryImageIndex !== -1 && galleryImages.length > 1;
  previousImageButton.hidden = !hasGalleryNavigation;
  nextImageButton.hidden = !hasGalleryNavigation;
  enlargedImage.src = image.currentSrc || image.src;
  enlargedImage.alt = image.alt;
  imageLightbox.setAttribute(
    'aria-label',
    image.alt ? `Zväčšený obrázok: ${image.alt}` : 'Zväčšený obrázok'
  );
  imageLightbox.showModal();
  closeImageLightbox.focus();
}

function showGalleryImage(index) {
  currentGalleryImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentGalleryImageIndex];
  enlargedImage.src = image.currentSrc || image.src;
  enlargedImage.alt = image.alt;
  imageLightbox.setAttribute(
    'aria-label',
    image.alt ? `Zväčšený obrázok: ${image.alt}` : 'Zväčšený obrázok'
  );
}

previousImageButton.addEventListener('click', () => showGalleryImage(currentGalleryImageIndex - 1));
nextImageButton.addEventListener('click', () => showGalleryImage(currentGalleryImageIndex + 1));

document.addEventListener('click', (event) => {
  const image = event.target.closest('img');
  if (!image || imageLightbox.contains(image)) return;

  event.preventDefault();
  openImageLightbox(image);
});

document.addEventListener('keydown', (event) => {
  if (imageLightbox.open && currentGalleryImageIndex !== -1 && galleryImages.length > 1) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showGalleryImage(currentGalleryImageIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showGalleryImage(currentGalleryImageIndex + 1);
    }
    return;
  }

  const image = event.target.closest('img[role="button"]');
  if (!image || (event.key !== 'Enter' && event.key !== ' ')) return;

  event.preventDefault();
  openImageLightbox(image);
});

document.querySelectorAll('img').forEach((image) => {
  image.classList.add('image-zoomable');
  if (image.closest('a, button')) return;

  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute(
    'aria-label',
    image.alt ? `${image.alt} – otvoriť na celú obrazovku` : 'Otvoriť obrázok na celú obrazovku'
  );
});

closeImageLightbox.addEventListener('click', () => imageLightbox.close());
imageLightbox.addEventListener('click', (event) => {
  if (event.target === imageLightbox) imageLightbox.close();
});

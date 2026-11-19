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
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

const searchForm = document.querySelector('#site-search');
const searchInput = document.querySelector('#search-query');
const searchResults = document.querySelector('#search-results');
const searchMain = document.querySelector('main');

const relatedSearchLinks = [
  { terms: ['smrek'], href: 'druhy-dreva.html#wood-smrek', label: 'Smrek – druhy dreva' },
  { terms: ['borovica'], href: 'druhy-dreva.html#wood-borovica', label: 'Borovica – druhy dreva' },
  { terms: ['smrekovec'], href: 'druhy-dreva.html#wood-smrekovec', label: 'Smrekovec – druhy dreva' },
  { terms: ['dub'], href: 'druhy-dreva.html#wood-dub', label: 'Dub – druhy dreva' },
  { terms: ['drevo', 'dreva', 'drevina', 'drevin'], href: 'druhy-dreva.html', label: 'Druhy dreva' },
  { terms: ['krov', 'krovy', 'rekonstrukcia', 'rekonstrukcie', 'strecha', 'strechy', 'zrub', 'zruby'], href: 'index.html#domov', label: 'Domov – zruby a krovy' },
  { terms: ['krov', 'krovy'], href: 'druhy-prace.html#service-strechy', label: 'Stavba striech a krovov – druhy prác' },
  { terms: ['rekonstrukcia', 'rekonstrukcie'], href: 'druhy-prace.html#service-rekonstrukcie', label: 'Rekonštrukcie – druhy prác' },
  { terms: ['strecha', 'strechy'], href: 'druhy-prace.html#service-strechy', label: 'Stavba striech – druhy prác' },
  { terms: ['zrub', 'zruby', 'zrubovy', 'zrubova'], href: 'druhy-prace.html#service-zruby', label: 'Stavba zrubových domov – druhy prác' },
  { terms: ['zrub', 'zruby', 'zrubovy', 'zrubova'], href: 'galeria.html#zruby', label: 'Zruby – galéria' },
  { terms: ['krov', 'krovy'], href: 'galeria.html#strechy', label: 'Krovy a strechy – galéria' },
  { terms: ['rekonstrukcia', 'rekonstrukcie'], href: 'galeria.html#rekonstrukcie', label: 'Rekonštrukcie – galéria' },
  { terms: ['strecha', 'strechy'], href: 'galeria.html#strechy', label: 'Strechy – galéria' },
  { terms: ['kontakt'], href: 'kontakt.html#contact-form', label: 'Kontaktujte nás' }
];

let generatedId = 0;
let highlightedElement;
let highlightTimer;
const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('sk')
    .trim();
}

function isSearchable(element) {
  return !element.closest('[hidden]') && !element.closest('.site-header');
}

function getHeadingText(element) {
  const heading = element.querySelector('h1, h2, h3, h4');
  return heading ? heading.textContent.trim() : '';
}

function getPageMatches(term) {
  const headings = [...searchMain.querySelectorAll('h1, h2, h3, h4')]
    .filter(isSearchable)
    .filter((heading) => normalizeSearchText(heading.textContent).includes(term))
    .map((element) => ({ element, label: element.textContent.trim() }));
  const details = [...searchMain.querySelectorAll('details')]
    .filter(isSearchable)
    .filter((element) => normalizeSearchText(element.textContent).includes(term))
    .map((element) => {
      const title = getHeadingText(element.closest('article') || element);
      const summary = element.querySelector('summary')?.textContent.trim();
      return {
        element,
        label: title ? `${title} – podrobnosti` : summary || 'Podrobnosti'
      };
    });

  const directMatches = [...headings, ...details];
  const matchingSections = [...searchMain.querySelectorAll('section')]
    .filter(isSearchable)
    .filter((section) => normalizeSearchText(section.textContent).includes(term));
  const sections = matchingSections
    .filter((section) => !directMatches.some(({ element }) => section.contains(element)))
    .filter((section) => !matchingSections.some((nested) => nested !== section && section.contains(nested)))
    .map((element) => ({
      element,
      label: getHeadingText(element) || element.getAttribute('aria-label') || 'Obsah stránky'
    }));

  return [...directMatches, ...sections]
    .sort((first, second) => {
      const position = first.element.compareDocumentPosition(second.element);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    });
}

function getRelatedLinks(term) {
  if (term.length < 2) return [];

  const currentPath = window.location.pathname;
  return relatedSearchLinks
    .filter(({ terms }) => terms.some((candidate) => {
      const normalizedCandidate = normalizeSearchText(candidate);
      return normalizedCandidate === term
        || (term.length >= 3 && normalizedCandidate.startsWith(term))
        || (term.includes(' ') && term.includes(normalizedCandidate));
    }))
    .filter(({ href }) => new URL(href, window.location.href).pathname !== currentPath);
}

function ensureTargetId(element) {
  if (element.id) return element.id;

  let id;
  do {
    generatedId += 1;
    id = `site-search-result-${generatedId}`;
  } while (document.getElementById(id));

  element.id = id;
  return id;
}

function openContainingDetails(element) {
  let parent = element.parentElement;
  while (parent) {
    if (parent.matches('details')) parent.open = true;
    parent = parent.parentElement;
  }
}

function highlight(element) {
  if (highlightedElement) highlightedElement.classList.remove('search-highlight');
  window.clearTimeout(highlightTimer);
  highlightedElement = element;
  element.classList.add('search-highlight');
  highlightTimer = window.setTimeout(() => {
    element.classList.remove('search-highlight');
    highlightedElement = undefined;
  }, 2400);
}

function createResultLink({ href, label }, onClick) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  if (onClick) link.addEventListener('click', onClick);

  const item = document.createElement('li');
  item.append(link);
  return item;
}

function renderResults(matches, relatedLinks) {
  searchResults.replaceChildren();

  if (!matches.length && !relatedLinks.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'search-results-empty';
    emptyMessage.textContent = 'Nenašli sa žiadne výsledky.';
    searchResults.append(emptyMessage);
  }

  if (matches.length) {
    const group = document.createElement('section');
    group.className = 'search-results-group';
    const heading = document.createElement('h2');
    heading.className = 'search-results-heading';
    heading.textContent = `Na tejto stránke (${matches.length})`;
    const list = document.createElement('ul');
    list.className = 'search-results-list';

    matches.forEach((match) => {
      const link = createResultLink(
        { href: `#${ensureTargetId(match.element)}`, label: match.label },
        (event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openContainingDetails(match.element);
          match.element.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
          highlight(match.element);
        }
      );
      list.append(link);
    });

    group.append(heading, list);
    searchResults.append(group);
  }

  if (relatedLinks.length) {
    const group = document.createElement('section');
    group.className = 'search-results-group';
    const heading = document.createElement('h2');
    heading.className = 'search-results-heading';
    heading.textContent = 'Súvisiace stránky';
    const list = document.createElement('ul');
    list.className = 'search-results-list';
    relatedLinks.forEach((result) => list.append(createResultLink(result)));
    group.append(heading, list);
    searchResults.append(group);
  }

  searchResults.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
}

if (searchForm && searchInput && searchResults && searchMain) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = normalizeSearchText(searchInput.value);
    if (!term) {
      searchResults.hidden = true;
      searchResults.replaceChildren();
      searchInput.setAttribute('aria-expanded', 'false');
      return;
    }

    const matches = getPageMatches(term);
    renderResults(matches, getRelatedLinks(term));

    if (matches[0]) {
      openContainingDetails(matches[0].element);
      matches[0].element.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
      highlight(matches[0].element);
    }
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      searchResults.hidden = true;
      searchInput.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
      searchResults.hidden = true;
      searchInput.setAttribute('aria-expanded', 'false');
    }
  });
}

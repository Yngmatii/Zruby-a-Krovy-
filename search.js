const searchForm = document.querySelector('#site-search');
const searchInput = document.querySelector('#search-query');
const searchResults = document.querySelector('#search-results');

const siteSearchIndex = [
  {
    label: 'O nás',
    href: 'o-nas.html',
    keywords: 'o nas kto sme tim tesari remeslo drevo skusenosti dôvera drevostavby kvalitne stavby'
  },
  {
    label: 'Poctivé drevo, remeslo a spoľahlivosť',
    href: 'o-nas.html',
    keywords: 'poctive drevo remeslo spolahlivost tradicie moderné technologie drevena stavba na mieru'
  },
  {
    label: 'Kto sme a čo robíme?',
    href: 'o-nas.html',
    keywords: 'kto sme co robime tesari odbornici zrubove domy krovy rekonstrukcia drevostavieb strechy'
  },
  {
    label: 'Prečo si vybrať práve nás?',
    href: 'o-nas.html',
    keywords: 'preco vybrat poctive remeslo individualny pristup kvalitne drevo skusenosti dôvera'
  },
  {
    label: 'Od prvého návrhu po dokončenie',
    href: 'o-nas.html',
    keywords: 'navrh material planovanie prac realizacia drevena stavba'
  },
  {
    label: 'Druhy prác',
    href: 'druhy-prace.html',
    keywords: 'druhy prac tesarske drevostavbarske služby zrub strecha krov rekonstrukcia altanok'
  },
  {
    label: 'Rekonštrukcie',
    href: 'druhy-prace.html#service-rekonstrukcie',
    keywords: 'rekonstrukcia rekonstrukcie obnovy oprava drevených stavieb zrubov krovu domov renovacia dreva'
  },
  {
    label: 'Stavba striech',
    href: 'druhy-prace.html#service-strechy',
    keywords: 'strecha strechy stavba krovu krovov montaz výroba na mieru dreveny trám'
  },
  {
    label: 'Stavba zrubových domov',
    href: 'druhy-prace.html#service-zruby',
    keywords: 'zrub zruby zrubovy dom drevodom stavba na kluc projekt vizualizacia drevo hranol'
  },
  {
    label: 'Výroba altánkov',
    href: 'druhy-prace.html',
    keywords: 'altanok altanky dreveny altan pergola pristresek na auto drevene pristrešky záhrada terasa'
  },
  {
    label: 'Drevené produkty na mieru',
    href: 'druhy-prace.html',
    keywords: 'lavicka lavicky hojdačka drevene produkty doplnky zahradny doplnok na mieru'
  },
  {
    label: 'Druhy dreva',
    href: 'druhy-dreva.html',
    keywords: 'druhy dreva dreviny drevo vlastnosti smrek borovica smrekovec dub porovnanie'
  },
  {
    label: 'Smrek',
    href: 'druhy-dreva.html#wood-smrek',
    keywords: 'smrek drevina drevo lahky opracovanie krovy konstrukcie interierové prvky'
  },
  {
    label: 'Borovica',
    href: 'druhy-dreva.html#wood-borovica',
    keywords: 'borovica drevina drevo pruzna stabilna kresba konstrukcia obklad terasa'
  },
  {
    label: 'Smrekovec',
    href: 'druhy-dreva.html#wood-smrekovec',
    keywords: 'smrekovec drevina drevo odolny pevny exterier fasada nosny system'
  },
  {
    label: 'Dub',
    href: 'druhy-dreva.html#wood-dub',
    keywords: 'dub drevina drevo tvrdý odolny kresba interier nosne konstrukcie'
  },
  {
    label: 'Galéria',
    href: 'galeria.html',
    keywords: 'galeria fotky fotografie realizacie obrazy práce projekty'
  },
  {
    label: 'Tradičné zruby',
    href: 'galeria.html#zruby',
    keywords: 'galeria zrub zruby drevodom stavba zrubovy dom'
  },
  {
    label: 'Rekonštrukcie',
    href: 'galeria.html#rekonstrukcie',
    keywords: 'galeria rekonstrukcia rekonstrukcie obnova dreveneho domu'
  },
  {
    label: 'Strechy',
    href: 'galeria.html#strechy',
    keywords: 'galeria strecha strechy krov krovy realizacia'
  },
  {
    label: 'Altánky',
    href: 'galeria.html#altanky',
    keywords: 'galeria altanok altanky dreveny drevene zahrada'
  },
  {
    label: 'Doplnky z dreva',
    href: 'galeria.html#vyrobky',
    keywords: 'galeria doplnky drevo drevene výrobky produkt'
  },
  {
    label: 'Videá',
    href: 'galeria.html#videa',
    keywords: 'galeria video videa realizacia strecha okna'
  },
  {
    label: 'Kontakt',
    href: 'kontakt.html',
    keywords: 'kontakt telefon email adresa martin teplicanec rajec formulár sprava'
  },
  {
    label: 'Kontaktný formulár',
    href: 'kontakt.html#contact-form',
    keywords: 'napisat konzultacia objednat kontakt formular email sprava meno telefon'
  }
];

function normalizeSearchText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('sk')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findGlobalMatches(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const queryWords = normalizedQuery.split(/\s+/);
  return siteSearchIndex
    .map((entry) => {
      const haystack = normalizeSearchText(`${entry.label} ${entry.keywords}`);
      const matchedWords = queryWords.filter((word) => haystack.includes(word)).length;
      return { entry, matchedWords };
    })
    .filter(({ matchedWords }) => matchedWords === queryWords.length)
    .sort((first, second) => {
      const exactFirst = normalizeSearchText(first.entry.label).includes(normalizedQuery);
      const exactSecond = normalizeSearchText(second.entry.label).includes(normalizedQuery);
      if (exactFirst !== exactSecond) return exactFirst ? -1 : 1;
      return second.matchedWords - first.matchedWords;
    });
}

function renderResults(matches) {
  searchResults.replaceChildren();

  if (!matches.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'search-results-empty';
    emptyMessage.textContent = 'Nenašli sa žiadne výsledky.';
    searchResults.append(emptyMessage);
  } else {
    const list = document.createElement('ul');
    list.className = 'search-results-list';

    matches.forEach(({ entry }) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = entry.href;
      link.textContent = entry.label;
      item.append(link);
      list.append(item);
    });

    searchResults.append(list);
  }

  searchResults.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
}

function performSearch() {
  const matches = findGlobalMatches(searchInput.value);
  renderResults(matches);
  return matches;
}

if (searchForm && searchInput && searchResults) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const matches = performSearch();
    if (matches.length === 1) {
      window.location.href = matches[0].entry.href;
    }
  });

  searchInput.addEventListener('input', performSearch);

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

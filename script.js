const searchForm = document.querySelector('#site-search');

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchInput = searchForm.querySelector('input');
    if (searchInput) {
      searchInput.blur();
    }
  });
}

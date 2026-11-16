const searchForm = document.querySelector('.site-search');
const searchInput = document.querySelector('.site-search input');

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchInput.blur();
  });
}

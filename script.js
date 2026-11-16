const searchForm = document.querySelector("#site-search");
const searchInput = document.querySelector("#search-query");
const searchStatus = document.querySelector("#search-status");
const form = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim().toLocaleLowerCase("sk");
    const match = [...document.querySelectorAll("main section[id]")].find((section) =>
      section.textContent.toLocaleLowerCase("sk").includes(query)
    );

    if (match) {
      if (searchStatus) {
        searchStatus.textContent = `Našli sme sekciu: ${match.querySelector("h1, h2")?.textContent.trim()}.`;
      }
      match.scrollIntoView({ behavior: "smooth" });
    } else if (searchStatus) {
      searchStatus.textContent = "Takýto obsah sme nenašli. Skúste napríklad strecha, smrek alebo altánok.";
    }
  });
}

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Ďakujeme. Formulár bude možné odoslať po doplnení firemného e-mailu.";
  });
}

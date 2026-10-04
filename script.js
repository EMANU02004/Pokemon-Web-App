const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=60&offset=0';

const grid = document.querySelector('#pokemon-grid');
const searchInput = document.querySelector('#search-input');
const resultCount = document.querySelector('#result-count');
const statusMessage = document.querySelector('#status-message');
const emptyState = document.querySelector('#empty-state');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const pageNumber = document.querySelector('#page-number');

let pokemon = [];
let currentPage = 1;
const pageSize = 20;

const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

function renderPokemon(list, totalResults) {
  grid.innerHTML = list.map((item) => `
    <article class="pokemon-card type-${item.types[0].toLowerCase()}">
      <span class="pokemon-number">#${String(item.id).padStart(3, '0')}</span>
      <div class="pokemon-image-wrap">
        <img class="pokemon-image" src="${item.image}" alt="${formatName(item.name)}" loading="lazy">
      </div>
      <h3 class="pokemon-name">${item.name}</h3>
      <div class="pokemon-details">
        <span class="type-label">${item.types.join(' / ')}</span>
        <span>Height: ${item.height} m</span>
        <span>Weight: ${item.weight} kg</span>
      </div>
      <button class="ability-button" type="button" data-name="${item.name}" data-ability="${item.ability}">
        Show ability
      </button>
      <p class="ability-text" hidden></p>
    </article>
  `).join('');

  resultCount.textContent = `${totalResults} ${totalResults === 1 ? 'result' : 'results'}`;
  emptyState.hidden = totalResults > 0;
  updatePagination(totalResults);
}

function updatePagination(totalResults) {
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
  previousButton.hidden = totalResults === 0;
  nextButton.hidden = totalResults === 0;
}

function getFilteredPokemon() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  return pokemon.filter((item) => item.name.includes(searchTerm));
}

function renderCurrentPage() {
  const filteredPokemon = getFilteredPokemon();
  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  renderPokemon(filteredPokemon.slice(start, start + pageSize), filteredPokemon.length);
}

function filterPokemon() {
  currentPage = 1;
  renderCurrentPage();
}

async function loadPokemon() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`PokéAPI returned ${response.status}`);
    }

    const listData = await response.json();
    pokemon = await Promise.all(listData.results.map(async (entry) => {
      const detailResponse = await fetch(entry.url);
      if (!detailResponse.ok) {
        throw new Error(`Could not load ${entry.name}`);
      }

      const detail = await detailResponse.json();
      return {
        id: detail.id,
        name: detail.name,
        ability: detail.abilities[0]?.ability.name || 'a mysterious power',
        types: detail.types.map((type) => formatName(type.type.name)),
        height: (detail.height / 10).toFixed(1),
        weight: (detail.weight / 10).toFixed(1),
        image: detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default
      };
    }));

    statusMessage.textContent = `${pokemon.length} Pokémon ready to explore`;
    renderCurrentPage();
  } catch (error) {
    console.error('Unable to load Pokémon:', error);
    statusMessage.textContent = 'Something went wrong while loading Pokémon.';
    grid.innerHTML = '';
    resultCount.textContent = '';
  }
}

searchInput.addEventListener('input', filterPokemon);

previousButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

nextButton.addEventListener('click', () => {
  const totalPages = Math.ceil(getFilteredPokemon().length / pageSize);
  if (currentPage < totalPages) {
    currentPage += 1;
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('.ability-button');
  if (!button) {
    return;
  }

  const ability = button.dataset.ability.replaceAll('-', ' ');
  const abilityText = button.nextElementSibling;
  const isVisible = !abilityText.hidden;

  abilityText.textContent = `I am ${formatName(button.dataset.name)} and I have ${ability}.`;
  abilityText.hidden = isVisible;
  button.textContent = isVisible ? 'Show ability' : 'Hide ability';
});

loadPokemon();

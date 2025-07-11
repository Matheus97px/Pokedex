const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const limit = 12
let offset = 0



function loadPokemonItens(offset, limit) {
    pokeApi.getPokemon(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li onclick='showPokemonDetails(${JSON.stringify(pokemon)})' class="pokemon  ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>

            </li>
        `).join('')

        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    loadPokemonItens(offset, limit)
})

document.querySelector(".modal-close").addEventListener("click", () => {
    document.querySelector("#pokemonModal").classList.remove("show");
    document.querySelector("#pokemonModal").classList.add("hidden");
});


function showPokemonDetails(pokemon) {
    const modal = document.getElementById('pokemonModal');
    const modalContent = modal.querySelector('.modal-content');
    const infoList = modal.querySelector(".modal-info-list");
    const statsList = modal.querySelector(".modal-stats-list");
    const tabButtons = document.querySelectorAll('.tab-button')
    const movesList = modal.querySelector(".modal-moves-list");
    movesList.innerHTML = "";

    pokemon.moves.slice(0, 20).forEach(move => {
        const li = document.createElement('li');
        li.innerText = move
        movesList.appendChild(li)
    })

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover .active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'))
            button.classList.add('active')

            // Esconder todas as abas
            document.querySelector('.about-tab').classList.add('hidden')
            document.querySelector('.stats-tab').classList.add('hidden')
            document.querySelector('.moves-tab').classList.add('hidden')

            // Mostrar aba selecionada
            const selected = button.dataset.tab
            document.querySelector(`.${selected}-tab`).classList.remove('hidden')
        })
    })



    statsList.innerHTML = ''

    pokemon.stats.forEach(stat => {
        const li = document.createElement('li');

        const label = document.createElement('div');
        label.className = 'stat-label';
        label.innerHTML = `<span>${stat.name.toUpperCase()}</span><span>${stat.base}</span>`;

        const bar = document.createElement('div');
        bar.className = 'stat-bar';

        const fill = document.createElement('div');
        fill.className = 'stat-fill';
        fill.style.width = `${stat.base > 100 ? 100 : stat.base}%`

        bar.appendChild(fill);
        li.appendChild(label);
        li.appendChild(bar);
        statsList.appendChild(li);
    })

    infoList.innerHTML = `
        <li><strong>Height:</strong> ${pokemon.height} m</li>
        <li><strong>Weight:</strong> ${pokemon.weight} kg</li>
        <li><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</li>
    
    `

    modalContent.classList.remove('fire', 'grass', 'water', 'electric', 'bug', 'poison', 'normal', 'psychic', 'ground', 'flying', 'rock', 'dark', 'dragon', 'ghost', 'fairy', 'ice', 'steel', 'fighting');

    modalContent.classList.add(pokemon.type);


    modal.querySelector(".modal-name").innerText = pokemon.name;
    modal.querySelector(".modal-number").innerText = `#${pokemon.number}`;
    // modal.querySelector(".modal-type").innerText = pokemon.types.join(' ');
    modal.querySelector(".modal-img").src = pokemon.photo;

    const typesContainer = modal.querySelector(".modal-types")
    typesContainer.innerHTML = ''
    pokemon.types.forEach(type => {
        const span = document.createElement('span')
        span.className = `type-tag ${type}`
        span.innerText = type
        typesContainer.appendChild(span)
    })



    modal.classList.remove('hidden');
    modal.classList.add('show');
    // const modaltype = document.querySelector('.modal-type');


}
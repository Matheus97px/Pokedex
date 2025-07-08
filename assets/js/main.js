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
    // const pokemon = document.querySelector(`.pokemon:nth-child(${pokemonId})`);
    const modal = document.getElementById('pokemonModal');

    modal.querySelector(".modal-name").innerText = pokemon.name;
    modal.querySelector(".modal-number").innerText = `#${pokemon.number}`;
    modal.querySelector(".modal-type").innerText = pokemon.types.join(', ');
    modal.querySelector(".modal-img").src = pokemon.photo;

    modal.classList.remove('hidden');
    modal.classList.add('show');
    const modalContent = document.querySelector('.modal-content');
    const modaltype = document.querySelector('.modal-type');
    modalContent.classList.remove('fire', 'grass', 'water', 'electric', 'bug', 'poison','normal', 'psychic', 'ground', 'flying', 'rock', 'dark','dragon', 'ghost', 'fairy', 'ice', 'steel', 'fighting');

    modalContent.classList.add(pokemon.type);
    // const number = pokemon.querySelector('.number').textContent;
    // const name = pokemon.querySelector('.name').textContent;
    // const types = Array.from(pokemon.querySelectorAll('.type')).map(type => type.textContent);
    // const photo = pokemon.querySelector('img').src;


    // alert(`Number: ${number}\nName: ${name}\nTypes: ${types.join(', ')}\nPhoto: ${photo}`);
}
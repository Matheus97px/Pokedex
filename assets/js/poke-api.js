const pokeApi = {}

async function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default

    pokemon.height = pokeDetail.height / 10 // em metros
    pokemon.weight = pokeDetail.weight / 10 // em kg
    pokemon.abilities = pokeDetail.abilities.map((slot) => slot.ability.name)

    pokemon.stats = pokeDetail.stats.map((stat) => ({
        name: stat.stat.name,
        base: stat.base_stat
    }));

    pokemon.moves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name);

    // Busca a cadeia de evolução
    const speciesResponse = await fetch(pokeDetail.species.url)
    const speciesData = await speciesResponse.json()

    const evolutionChainUrl = speciesData.evolution_chain.url
    const evolutionReponse = await fetch(evolutionChainUrl)
    const evolutionData = await evolutionReponse.json()

    // funcao recursiva para mapear todos os estagios da cadeia
    const evolutionList = []
    function extractEvolution(chain) {
        const name = chain.species.name
        evolutionList.push(name)

        if (chain.evolves_to.length > 0) {
             extractEvolution(chain.evolves_to[0])
        }
    }
    extractEvolution(evolutionData.chain)

    // Busca detalhes (imagem e numeros) para cada evolução
    const evolutionDetails = await Promise.all(evolutionList.map(async (name) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = await res.json()
        return {
            name: data.name,
            number: data.id,
            image: data.sprites.front_default
            // image: data.sprites.other['official-artwork'].front_default
        }
    }))

    pokemon.evolution = evolutionDetails


    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemon = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails)
}


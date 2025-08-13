export const KANTO_MAX_ID = 151

export async function getPokemonList() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${KANTO_MAX_ID}`)
  const data = await res.json() as { results: { name: string }[] }
  return data.results
}

export async function getPokemonSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/${id}.png`
}

export async function getPokemonText(id: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  const data = await res.json() as { flavor_text_entries: { flavor_text: string, language: { name: string } }[] }
  const englishEntry = data.flavor_text_entries.find((data) => data.language.name === 'en')!
  return englishEntry.flavor_text.replaceAll('\u000C', ' ')
}

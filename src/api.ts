import { MAX_ID } from './App'

export const getPokemonList = async () => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${MAX_ID}`)
  const data = await res.json() as { results: { name: string }[] }
  return data.results
}

export const getPokemonSpriteUrl = async (id: number) => {
  return `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/${id}.png`
}

export const getPokemonText = async (id: number) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  const data = await res.json() as { flavor_text_entries: { flavor_text: string, language: { name: string } }[] }
  const englishEntry = data.flavor_text_entries.find((data) => data.language.name === 'en')!
  return englishEntry.flavor_text.replaceAll('\u000C', ' ')
}

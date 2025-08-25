import React, { FormEvent, useEffect, useState } from 'react'
import { getPokemonList, getPokemonSpriteUrl, getPokemonText, MAX_ID } from './api'

interface PokemonDetails {
  id: number
  name: string
  label: string
}

const MIN_FILTER_LENGTH = 2
const INIT_ID = 1

const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [allPokemon, setAllPokemon] = useState([] as PokemonDetails[])
  const [currentId, setCurrentId] = useState(INIT_ID)
  const [filter, setFilter] = useState('')
  const [filteredPokemon, setFilteredPokemon] = useState([] as PokemonDetails[])
  const [spriteUrl, setSpriteUrl] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    async function init() {
      const results = await getPokemonList()
      const pokemon = results.map(({ name }, index) => {
        return { id: index + 1, name: name, label: name[0].toUpperCase() + name.slice(1)}
      })
      setAllPokemon(pokemon)
    }
    init()
    onChangeId(INIT_ID)
  }, [])

  const onChangeId = async (id: number) => {
    setCurrentId(id)
    setFilter('')
    setFilteredPokemon([])

    setIsLoading(true)
    const url = await getPokemonSpriteUrl(id)
    const text = await getPokemonText(id)
    
    setSpriteUrl(url)
    setText(`#${id}. ${text}`)
    setIsLoading(false)
  }

  const onChangeFilter = (e: FormEvent) => {
    const { value } = e.target as HTMLInputElement
    setFilter(value)

    if (value.length >= MIN_FILTER_LENGTH) {
      const lowerStr = value.toLowerCase()
      const currentIndex = currentId - 1
      const filtered = allPokemon.filter(({ name }, index) => name.includes(lowerStr) && index !== currentIndex)
      const current = allPokemon[currentIndex]
      filtered.unshift(current)
      setFilteredPokemon(filtered)
    } else {  
      setFilteredPokemon([])
    }
  }

  const pokemon = filteredPokemon.length ? filteredPokemon : allPokemon
  const options = pokemon.map(({ id, label }) => {
    return <option key={id} value={id} onClick={() => onChangeId(id)}>{label}</option>
  })

  const sprite = <img id='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = spriteUrl
  }

  const previous = <button onClick={() => onChangeId(currentId - 1)} disabled={currentId === 1}>Previous</button>
  const next = <button className='floatRight' onClick={() => onChangeId(currentId + 1)} disabled={currentId === MAX_ID}>Next</button>

  return (
    <>
      <h1>Pokédex</h1>
      <div id='card' className='card'>
        <div id='filterContainer' className='filterContainer'>
          <label>Filter: </label>
          <input type='text' name={'filter'} value={filter} onChange={onChangeFilter} placeholder={`min ${MIN_FILTER_LENGTH} characters`} />
        </div>
        <select className='select' value={currentId} size={5}>
          {options}
        </select>
        <div id='spriteContainer' className='spriteContainer'>
          {sprite}
        </div>
        <div id='text' className='text'>
          {isLoading ? 'LOADING' : text}
        </div>
        <div id='actionsContainer' className='actionsContainer'>
          {previous}
          {next}
        </div>
      </div>
    </>
  )
}

export default App

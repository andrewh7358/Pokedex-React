import React, { FormEvent, useEffect, useState } from 'react'
import { getPokemonList, getPokemonSpriteUrl, getPokemonText, MAX_ID } from './api'

interface PokemonDetails {
  id: number
  name: string
  label: string
}

const MIN_FILTER_LENGTH = 2

const App = () => {
  const [allPokemon, setAllPokemon] = useState([] as PokemonDetails[])
  const [currentId, setCurrentId] = useState(1)
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
  }, [])

  useEffect(() => {
    setFilter('')
  }, [currentId])

  useEffect(() => {
    async function getSpriteUrl() {
      const url = await getPokemonSpriteUrl(currentId)
      setSpriteUrl(url)
    }
    getSpriteUrl()
  }, [currentId])

  useEffect(() => {
    async function getText() {
      const text = await getPokemonText(currentId)
      setText(`#${currentId}. ${text}`)
    }
    getText()
  }, [currentId])

  useEffect(() => {
    if (filter.length >= MIN_FILTER_LENGTH) {
      const currentIndex = currentId - 1
      const filtered = allPokemon.filter(({ name }, index) => name.includes(filter) && index !== currentIndex)
      const current = allPokemon[currentIndex]
      filtered.unshift(current)
      setFilteredPokemon(filtered)
    } else {
      setFilteredPokemon([])
    }
  }, [filter])

  const onChangeFilter = (e: FormEvent) => {
    const { value } = e.target as HTMLInputElement
    setFilter(value)
  }

  const pokemon = filteredPokemon.length ? filteredPokemon : allPokemon
  const options = pokemon.map(({ id, label }) => {
    return <option key={id} value={id} onClick={() => setCurrentId(id)}>{label}</option>
  })

  const sprite = <img id='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = spriteUrl
  }

  const previous = <button onClick={() => setCurrentId(currentId - 1)} disabled={currentId === 1}>Previous</button>
  const next = <button className='floatRight' onClick={() => setCurrentId(currentId + 1)} disabled={currentId === MAX_ID}>Next</button>

  return (
    <>
      <h1>Pokédex</h1>
      <div id='card' className='card'>
        <div id='filterContainer' className='filterContainer'>
          <label>
            {'Filter: '}
            <input type='text' name={'filter'} value={filter} onChange={onChangeFilter} placeholder={`min ${MIN_FILTER_LENGTH} characters`} />
          </label>
        </div>
        <select className='select' value={currentId} size={5}>
          {options}
        </select>
        <div id='spriteContainer' className='spriteContainer'>
          {sprite}
        </div>
        <div id='text' className='text'>
          {text}
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

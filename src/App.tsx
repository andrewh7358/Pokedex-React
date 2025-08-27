import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { getPokemonList, getPokemonSpriteUrl, getPokemonText, MAX_ID } from './api'
import { Card } from './Card'

interface PokemonDetails {
  id: number
  name: string
  label: string
}

const MIN_FILTER_LENGTH = 2
const INIT_ID = 1

export const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [allPokemon, setAllPokemon] = useState([] as PokemonDetails[])
  const [currentId, setCurrentId] = useState(INIT_ID)
  const [filter, setFilter] = useState('')
  const [filteredPokemon, setFilteredPokemon] = useState([] as PokemonDetails[])
  const [spriteUrl, setSpriteUrl] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const results = await getPokemonList()
      const pokemon = results.map(({ name }, index): PokemonDetails => {
        return { id: index + 1, name: name, label: name[0].toUpperCase() + name.slice(1) }
      })
      setAllPokemon(pokemon)
      onChangeId(INIT_ID)
    }
    init()
  }, [])

  const onChangeId = async (id: number) => {
    setCurrentId(id)
    setIsLoading(true)
    const url = await getPokemonSpriteUrl(id)
    const text = await getPokemonText(id)
    setSpriteUrl(url)
    setText(`#${id}. ${text}`)
    setIsLoading(false)
  }

  const onChangeIdEvent = async (e: FormEvent) => {
    const { value } = e.target as HTMLSelectElement
    const id = Number(value)
    await onChangeId(id)
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
  const options = useMemo(() => pokemon.map(({ id, label }) => <option key={id} value={id}>{label}</option>), [pokemon])

  const sprite = <img id='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = isLoading ? 'https://i.gifer.com/ZZ5H.gif' : spriteUrl
  }

  const previous = <button onClick={() => onChangeId(currentId - 1)} disabled={currentId === 1}>Previous</button>
  const next = <button className='floatRight' onClick={() => onChangeId(currentId + 1)} disabled={currentId === MAX_ID}>Next</button>

  return (
    <div className='app'>
      <Card className='card'>
        <div className='filterContainer'>
          <label htmlFor='filter'>Filter: </label>
          <input id='filter' type='text' value={filter} onChange={onChangeFilter} placeholder={`min ${MIN_FILTER_LENGTH} characters`} />
        </div>
        <select className='select' value={currentId} size={5} onChange={onChangeIdEvent}>
          {options}
        </select>
        <div className='spriteContainer'>
          {sprite}
        </div>
        <div className='textContainer'>
          {isLoading ? 'LOADING' : text}
        </div>
        <div className='actionsContainer'>
          {previous}
          {next}
        </div>
      </Card>
    </div>
  )
}

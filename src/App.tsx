import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { getPokemonList, getPokemonSpriteUrl, getPokemonText } from './api'
import { Card } from './Card'

interface PokemonDetails {
  id: number
  name: string
  label: string
}

const MIN_FILTER_LENGTH = 2
export const MIN_ID = 1
export const MAX_ID = 1025

export const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [allPokemon, setAllPokemon] = useState([] as PokemonDetails[])
  const [currentId, setCurrentId] = useState(MIN_ID)
  const [filter, setFilter] = useState('')
  const [filteredPokemon, setFilteredPokemon] = useState([] as PokemonDetails[])
  const [spriteUrl, setSpriteUrl] = useState('')
  const [text, setText] = useState('')
  const [goTo, setGoTo] = useState('')

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const results = await getPokemonList()
      const pokemon = results.map(({ name }, index): PokemonDetails => {
        return { id: index + 1, name, label: name[0].toUpperCase() + name.slice(1) }
      })
      setAllPokemon(pokemon)
      handleChangeId(MIN_ID)
    }
    init()
  }, [])

  const handleChangeId = async (id: number) => {
    setCurrentId(id)
    setIsLoading(true)
    const url = await getPokemonSpriteUrl(id)
    const text = await getPokemonText(id)
    setSpriteUrl(url)
    setText(`#${id}. ${text}`)
    setIsLoading(false)
  }

  const handleChangeIdEvent = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const id = Number(value)
    await handleChangeId(id)
  }

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
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
  const options = useMemo(() => pokemon.map(({ id, label }) => <option key={'option' + id} value={id}>{label}</option>), [pokemon])

  const sprite = <img id='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = isLoading ? 'https://i.gifer.com/ZZ5H.gif' : spriteUrl
  }

  const handleGoTo = (e: FormEvent) => {
    e.preventDefault()
    const nextId = Number(goTo)

    if (isNaN(nextId) || nextId < MIN_ID || nextId > MAX_ID) {
      return
    }

    handleChangeId(nextId)
    setFilter('')
    setFilteredPokemon([])
  }

  const handleChangeGoTo = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setGoTo(value)
  }

  return (
    <div className='app'>
      <Card className='card'>
        <div className='filterContainer'>
          <label htmlFor='filter'>Filter: </label>
          <input id='filter' type='text' value={filter} onChange={handleChangeFilter} placeholder={`min ${MIN_FILTER_LENGTH} characters`} />
        </div>
        <select className='select' value={currentId} size={5} onChange={handleChangeIdEvent}>
          {options}
        </select>
        <div className='spriteContainer'>
          {sprite}
        </div>
        <div className='textContainer'>
          {isLoading ? 'LOADING' : text}
        </div>
        <div className='actionsContainer'>
          <form onSubmit={handleGoTo}>
            <label htmlFor='goTo'>Go To: </label>
            <input id='goTo' type='number' name='goTo' onChange={handleChangeGoTo} />
          </form>
        </div>
      </Card>
    </div>
  )
}

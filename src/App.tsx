import React, { FormEvent, useEffect, useMemo, useState } from 'react'
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
    async function init() {
      setIsLoading(true)
      const results = await getPokemonList()
      const pokemon = results.map(({ name }, index): PokemonDetails => {
        return { id: index + 1, name: name, label: name[0].toUpperCase() + name.slice(1) }
      })
      setAllPokemon(pokemon)
      onChangeId(MIN_ID)
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
  const options = useMemo(() => pokemon.map(({ id, label }) => <option key={'option' + id} value={id}>{label}</option>), [pokemon])

  const sprite = <img id='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = isLoading ? 'https://i.gifer.com/ZZ5H.gif' : spriteUrl
  }

  const onSubmitGoTo = (e: FormEvent) => {
    e.preventDefault()
    const nextId = Number(goTo)

    if (isNaN(nextId) || nextId < MIN_ID || nextId > MAX_ID) {
      return
    }

    onChangeId(nextId)
    setFilter('')
    setFilteredPokemon([])
  }

  const onChangeGoTo = (e: FormEvent) => {
    const { value } = e.target as HTMLInputElement
    setGoTo(value)
  }

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
          <form onSubmit={onSubmitGoTo}>
            <label htmlFor='goTo'>Go To: </label>
            <input id='goTo' type='number' name='goTo' onChange={onChangeGoTo} />
          </form>
        </div>
      </Card>
    </div>
  )
}

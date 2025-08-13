import React, { useEffect, useState } from 'react'
import { getPokemonList, getPokemonSpriteUrl, getPokemonText, KANTO_MAX_ID } from './api'

const App = () => {
  const [pokemonNames, setPokemonNames] = useState([] as string[])
  const [currentId, setCurrentId] = useState(1)
  const [spriteUrl, setSpriteUrl] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    async function getNames() {
      const results = await getPokemonList()
      const names = results.map(({ name }) => name[0].toUpperCase() + name.slice(1))
      setPokemonNames(names)
    }
    getNames()
  }, [])

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
      setText(text)
    }
    getText()
  }, [currentId])

  const options = pokemonNames.map((name, index) => {
    const id = index + 1
    return <option key={id} value={id} onClick={() => setCurrentId(id)}>{name}</option>
  })

  const sprite = <img id='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = spriteUrl
  }

  const previous = <button onClick={() => setCurrentId(currentId - 1)} disabled={currentId === 1}>Previous</button>
  const next = <button className='floatRight' onClick={() => setCurrentId(currentId + 1)} disabled={currentId === KANTO_MAX_ID}>Next</button>

  return (
    <>
      <h1>Kanto Pokédex</h1>
      <div id='card' className='card'>
        <select className='select' value={currentId}>
          {options}
        </select>
        <div id='spriteContainer' className='spriteContainer'>
          {sprite}
        </div>
        <div id='text' className='text'>
          {`#${currentId}. ${text}`}
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

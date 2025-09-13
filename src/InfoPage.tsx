import React, { useEffect, useState } from 'react'
import { getPokemonDetails, getPokemonSpriteUrl, getPokemonText } from './api'
import { MAX_ID, MIN_ID } from './App'
import { capitalizeStr, normailizeName } from './util'

interface InfoPageProps {
  currentId: number
  onBack: () => void
  onChangeId: (id: number) => void
}

interface PokemonDetails {
  name: string
  types: { type: { name: string} }[]
  height: string
  weight: string
}

export const InfoPage = ({ currentId, onBack, onChangeId }: InfoPageProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('')
  const [info, setInfo] = useState<PokemonDetails>({ name: '', types: [], height: '', weight: '' })

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const text = await getPokemonText(currentId)
      const res = await getPokemonDetails(currentId)
      setText(text)
      setInfo({ name: normailizeName(res.name), types: res.types, height: res.height, weight: res.weight })
      setIsLoading(false)
    }
    init()
  }, [currentId])

  const sprite = <img id='sprite' alt='sprite' className='sprite' />
  const spriteImgTag = document.getElementById('sprite') as HTMLImageElement

  if (spriteImgTag) {
    spriteImgTag.src = isLoading ? 'https://i.gifer.com/ZZ5H.gif' : getPokemonSpriteUrl(currentId)
  }

  const types = info.types.map((type) => capitalizeStr(type.type.name)).join(', ')
  const content = (
    <>
      <div className='infoRow'>
        {`#${currentId} ${info.name}`}
      </div>
      <div className='infoRow'>
        {`Type: ${types}`}
      </div>
      <div className='infoRow'>
        {`Height: ${Number(info.height) / 10} m`}
      </div>
      <div className='infoRow'>
        {`Weight: ${Number(info.weight) / 10} kg`}
      </div>
      <div className='infoRow'>
        {text}
      </div>
    </>
  )

  return (
    <div className='grid'>
      <div>
        <button onClick={onBack}>Go Back</button>
        <div className='spriteContainer'>
          {sprite}
        </div>
        <div className='actionsContainer'>
          <button className='action' disabled={currentId === MIN_ID} onClick={() => onChangeId(currentId - 1)}>Prev</button>
          <button className='action' disabled={currentId === MAX_ID} onClick={() => onChangeId(currentId + 1)}>Next</button>
        </div>
      </div>
      <div>
        {isLoading ? 'LOADING...' : content}
      </div>
    </div>
  )
}

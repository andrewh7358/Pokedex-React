import React, { ChangeEvent, FormEvent, JSX, MouseEvent, useEffect, useState } from 'react'
import { getPokemonList } from './api'
import { MAX_ID, MIN_ID } from './App'
import { normailizeName } from './util'

interface SelectPageProps {
  currentId: number
  onSelect: (id: number) => void
}

const MIN_FILTER_LENGTH = 2

export const SelectPage = ({ currentId, onSelect }: SelectPageProps) => {
  const [allOptions, setAllOptions] = useState<JSX.Element[]>([])
  const [filter, setFilter] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<JSX.Element[]>([])
  const [goTo, setGoTo] = useState('')

  useEffect(() => {
    const init = async () => {
      const res = await getPokemonList()
      const all = res.map(({ name }, index) => {
        const id = index + 1
        const key = `${name.replaceAll('-', '')}_${id}`
        const label = normailizeName(name)
        return <option key={key} value={id}>{label}</option>
      })
      setAllOptions(all)
    }
    init()
  }, [])

  const handleSelect = (e: MouseEvent) => {
    const { value } = e.target as HTMLSelectElement
    const id = Number(value)
    onSelect(id)
  }

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFilter(value)

    if (value.length >= MIN_FILTER_LENGTH) {
      const lowerStr = value.replaceAll(' ', '').toLowerCase()
      const currentIndex = currentId - 1
      const filtered = allOptions.filter((option, index) => option.key!.includes(lowerStr) && index !== currentIndex)
      const current = allOptions[currentIndex]
      filtered.unshift(current)
      setFilteredOptions(filtered)
    }
  }

  const handleGoTo = (e: FormEvent) => {
    e.preventDefault()
    const nextId = Number(goTo)

    if (isNaN(nextId) || nextId < MIN_ID || nextId > MAX_ID) {
      return
    }

    onSelect(nextId)
  }

  const handleChangeGoTo = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setGoTo(value)
  }

  const options = filter.length >= MIN_FILTER_LENGTH ? filteredOptions : allOptions

  return (
    <div className='grid'>
      <div>
        <div className='flexRow'>
          <label htmlFor='filter'>Filter: </label>
          <input id='filter' value={filter} onChange={handleChangeFilter} placeholder={`(min ${MIN_FILTER_LENGTH} characters)`} />
        </div>
        <form className='flexRow' onSubmit={handleGoTo}>
          <label htmlFor='goTo'>Go to: </label>
          <input id='goTo' type='number' onChange={handleChangeGoTo} placeholder='(press Enter)' />
        </form>
      </div>
      <select value={currentId} size={18} onClick={handleSelect}>
        {options}
      </select>
    </div>
  )
}

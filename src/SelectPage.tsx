import React, { ChangeEvent, FormEvent, JSX, MouseEvent, useState } from 'react'
import { MAX_ID, MIN_FILTER_LENGTH, MIN_ID } from './App'

interface SelectPageProps {
  allOptions: JSX.Element[]
  currentId: number
  filter: string
  filteredOptions: JSX.Element[]
  onSelect: (id: number) => void
  onChangeFilter: (filter: string) => void
}

export const SelectPage = ({ allOptions, currentId, filter, filteredOptions, onSelect, onChangeFilter }: SelectPageProps) => {
  const [goTo, setGoTo] = useState('')

  const handleSelect = (e: MouseEvent) => {
    const { value } = e.target as HTMLSelectElement
    const id = Number(value)
    onSelect(id)
  }

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onChangeFilter(value)
  }

  const handleGoTo = (e: FormEvent) => {
    e.preventDefault()
    const nextId = Number(goTo)

    if (isNaN(nextId) || nextId < MIN_ID || nextId > MAX_ID) {
      return
    }

    onChangeFilter('')
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
      <select defaultValue={currentId} size={18} onClick={handleSelect}>
        {options}
      </select>
    </div>
  )
}

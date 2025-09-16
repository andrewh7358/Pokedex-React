import React, { JSX, useEffect, useState } from 'react'
import { getPokemonList } from './api'
import { Card } from './Card'
import { InfoPage } from './InfoPage'
import { SelectPage } from './SelectPage'
import { normailizeName } from './util'

export const MIN_ID = 1
export const MAX_ID = 151
export const MIN_FILTER_LENGTH = 2

export const App = () => {
  const [showSelectPage, setShowSelectPage] = useState(true)
  const [allOptions, setAllOptions] = useState<JSX.Element[]>([])
  const [currentId, setCurrentId] = useState(MIN_ID)
  const [filter, setFilter] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<JSX.Element[]>([])

  useEffect(() => {
    const init = async () => {
      const res = await getPokemonList()
      const all = res.map(({ name }, index) => {
        const id = index + 1
        const key = `${name.replaceAll('-', '')}`
        const label = normailizeName(name)
        return <option key={key} value={id}>{label}</option>
      })
      setAllOptions(all)
    }
    init()
  }, [])

  const handleSelect = (id: number) => {
    setCurrentId(id)
    setShowSelectPage(false)
  }

  const handleChangeFilter = (filter: string) => {
    setFilter(filter)

    if (filter.length >= MIN_FILTER_LENGTH) {
      const lowerStr = filter.replaceAll(' ', '').toLowerCase()
      const filtered = (allOptions).filter((option) => option.key!.includes(lowerStr))
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions([])
    }
  }

  const handleBack = () => {
    setShowSelectPage(true)
  }

  const selectPage = (
    <SelectPage
      allOptions={allOptions}
      currentId={currentId}
      filter={filter}
      filteredOptions={filteredOptions}
      onSelect={handleSelect}
      onChangeFilter={handleChangeFilter}
    />
  )
  const infoPage = <InfoPage currentId={currentId} onBack={handleBack} onChangeId={setCurrentId} />

  return (
    <div className='app'>
      <Card>
        {showSelectPage ? selectPage : infoPage}
      </Card>
    </div>
  )
}

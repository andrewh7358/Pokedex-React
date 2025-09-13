import React, { useState } from 'react'
import { Card } from './Card'
import { InfoPage } from './InfoPage'
import { SelectPage } from './SelectPage'

export const MIN_ID = 1
export const MAX_ID = 1025

export const App = () => {
  const [showSelectPage, setShowSelectPage] = useState(true)
  const [currentId, setCurrentId] = useState(MIN_ID)

  const handleSelect = (id: number) => {
    setCurrentId(id)
    setShowSelectPage(false)
  }

  const handleBack = () => {
    setShowSelectPage(true)
  }

  return (
    <div className='app'>
      <Card>
        {showSelectPage
          ? <SelectPage currentId={currentId} onSelect={handleSelect} />
          : <InfoPage currentId={currentId} onBack={handleBack} onChangeId={setCurrentId} />
        }
      </Card>
    </div>
  )
}

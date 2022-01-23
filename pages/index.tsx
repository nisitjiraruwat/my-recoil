import type { NextPage } from 'next'
import { useState } from 'react'

import useTodiList from '@/hooks/useTodiList'

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [inputValue2, setInputValue2] = useState('')
  const {todoList, addItem, todoLength} = useTodiList('1')
  const {todoList: todoList2, addItem: addItem2, todoLength: todoLength2} = useTodiList('3')

  const handleAddItem = () => {
    addItem(inputValue)
    setInputValue('')
  }

  const handleAddItem2 = () => {
    addItem2(inputValue)
    setInputValue2('')
  }

  const onChange = ({target: { value }}: { target: { value: string } }) => {
    setInputValue(value)
  }

  const onChange2 = ({target: { value }}: { target: { value: string } }) => {
    setInputValue2(value)
  }

  return (
    <div className='grid grid-cols-2'>
      <div>
        <div>
          <input className='border' type="text" value={inputValue} onChange={onChange} />
          <button onClick={handleAddItem}>Add {todoLength}</button>
        </div>
        {todoList.map((todoItem, index) => (
          <div key={index}>{todoItem}</div>
        ))}
      </div>
      <div>
        <div>
          <input className='border' type="text" value={inputValue2} onChange={onChange2} />
          <button onClick={handleAddItem2}>Add {todoLength2}</button>
        </div>
        {todoList2.map((todoItem, index) => (
          <div key={`B-${index}`}>{todoItem}</div>
        ))}
      </div>
    </div>
  )
}

export default Home

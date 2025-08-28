import { useState, useEffect } from 'react'
import { Task } from './task'

const TASKS = [
  {
    id: 1,
    name: 'Task 1'
  },
  {
    id: 2,
    name: 'Task 2'
  }
]

function App() {
  const [tasks, setTasks] = useState(TASKS)

  const [inputVal, setInputVal] = useState('')

  const handleClickAddBtn = () => {
    setTasks([...tasks, {id: crypto.randomUUID(), name: inputVal}])
    setInputVal('')
  }

  // useEffect(() => {
  //   //fetch
  //   setTasks()

  //   return () => console.log('Deleted')
  // }, [])

  return (
    <>
      {
        tasks.map(t => <Task key={t.id} name={t.name} id={t.id} deleteTask={(id) => setTasks([...tasks.slice(0, id - 1), ...tasks.slice(id + 1)])}/>)
      }
      <input value={inputVal} onChange={e => setInputVal(e.target.value)}/>
      <button onClick={handleClickAddBtn}>Button</button>
    </>
  )
}

export default App

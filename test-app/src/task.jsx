import { useEffect } from 'react'

const Task = ({ id, name, deleteTask }) => {
    useEffect(() => {
        return () => console.log('Deleted')
    }, [])

    return (
        <div onClick={() => deleteTask(id)}>{name}</div>
    )
}

export { Task }
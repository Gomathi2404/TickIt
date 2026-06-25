import { useState, useEffect } from "react"
import "./App.css"

const API = "http://localhost:8000"

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  const addTask = async () => {
    if (input === "") return
    if (tasks.some(t => t.text === input)) return
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, done: false })
    })
    const data = await res.json()
    setTasks([...tasks, { _id: data.id, text: input, done: false }])
    setInput("")
  }

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" })
    setTasks(tasks.filter(t => t._id !== id))
  }

  const toggleTask = async (task) => {
    await fetch(`${API}/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task.text, done: !task.done })
    })
    setTasks(tasks.map(t => t._id === task._id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="container">
      <h1>TickIt 🔥</h1>
      <p className="count">
  {tasks.filter(t => t.done).length} / {tasks.length} completed
</p>
      <div className="input-row">
        <input
          type="text"
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>ADD</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ textDecoration: task.done ? "line-through" : "none" }}>
            {task.text}
            <button className="done-btn" onClick={() => toggleTask(task)}>✅</button>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
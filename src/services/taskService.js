import { mockTasks } from '../data/mockTasks'

const TASKS_STORAGE_KEY = 'crud-app-tasks'
const NEXT_ID_STORAGE_KEY = 'crud-app-next-id'

function readTasksFromStorage() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function readNextIdFromStorage(taskList) {
  try {
    const raw = localStorage.getItem(NEXT_ID_STORAGE_KEY)
    if (raw) {
      const id = Number(raw)
      if (!Number.isNaN(id)) {
        return id
      }
    }
  } catch {
    // Ignore invalid stored next id.
  }

  const maxId = taskList.reduce(
    (max, task) => Math.max(max, task.id),
    0,
  )
  return maxId + 1
}

function persistTasks(taskList, nextTaskId) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(taskList))
  localStorage.setItem(NEXT_ID_STORAGE_KEY, String(nextTaskId))
}

const initialTasks = readTasksFromStorage() ?? [...mockTasks]
let tasks = initialTasks
let nextId = readNextIdFromStorage(initialTasks)

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getTasks() {
  await delay()
  return [...tasks]
}

export async function createTask(title) {
  await delay()
  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  }
  tasks = [newTask, ...tasks]
  persistTasks(tasks, nextId)
  return newTask
}

export async function updateTask(id, updates) {
  await delay()
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) {
    throw new Error(`Task with id ${id} not found`)
  }
  tasks[index] = { ...tasks[index], ...updates }
  persistTasks(tasks, nextId)
  return tasks[index]
}

export async function deleteTask(id) {
  await delay()
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) {
    throw new Error(`Task with id ${id} not found`)
  }
  tasks = tasks.filter((task) => task.id !== id)
  persistTasks(tasks, nextId)
}

export async function clearCompletedTasks() {
  await delay()
  tasks = tasks.filter((task) => !task.completed)
  persistTasks(tasks, nextId)
  return [...tasks]
}

import { useCallback, useMemo, useState } from 'react'
import { TaskContext } from './taskContext'
import * as taskService from '../services/taskService'

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message ?? '加载任务失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const addTask = useCallback(async (title) => {
    setError(null)

    try {
      const newTask = await taskService.createTask(title)
      setTasks((prev) => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err.message ?? '创建任务失败')
      throw err
    }
  }, [])

  const updateTask = useCallback(async (id, updates) => {
    setError(null)
    let previousTask = null

    setTasks((prev) => {
      previousTask = prev.find((task) => task.id === id)
      return prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      )
    })

    try {
      const updated = await taskService.updateTask(id, updates)
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task)),
      )
      return updated
    } catch (err) {
      if (previousTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? previousTask : task)),
        )
      }
      setError(err.message ?? '更新任务失败')
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id) => {
    setError(null)

    try {
      await taskService.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      setError(err.message ?? '删除任务失败')
      throw err
    }
  }, [])

  const clearCompleted = useCallback(async () => {
    setError(null)

    try {
      const remaining = await taskService.clearCompletedTasks()
      setTasks(remaining)
      return remaining
    } catch (err) {
      setError(err.message ?? '清除已完成任务失败')
      throw err
    }
  }, [])

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      clearCompleted,
      refreshTasks,
    }),
    [
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      clearCompleted,
      refreshTasks,
    ],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import SearchBar from '../components/SearchBar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { useTasks } from '../hooks/useTasks'

export default function TasksPage() {
  const { tasks, loading, error, refreshTasks, clearCompleted } = useTasks()
  const [searchQuery, setSearchQuery] = useState('')
  const [isClearing, setIsClearing] = useState(false)

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return tasks
    }

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(query),
    )
  }, [tasks, searchQuery])

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  )

  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  const handleClearCompleted = async () => {
    const confirmed = window.confirm(
      `确定清除 ${completedCount} 个已完成任务吗？`,
    )
    if (!confirmed) {
      return
    }

    setIsClearing(true)

    try {
      await clearCompleted()
      toast.success('已清除已完成任务')
    } catch {
      toast.error('清除已完成任务失败')
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <main className="tasks-page">
      <h1>任务列表</h1>

      {loading && <Loading text="Loading..." />}
      {!loading && (
        <>
          {error && <p className="tasks-page__error">错误：{error}</p>}
          <TaskForm />
          {!error && (
            <>
              <div className="tasks-page__toolbar">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                {completedCount > 0 && (
                  <button
                    type="button"
                    className="tasks-page__clear-btn"
                    onClick={handleClearCompleted}
                    disabled={isClearing}
                  >
                    {isClearing ? '清除中...' : 'Clear completed'}
                  </button>
                )}
              </div>
              <TaskList
                tasks={filteredTasks}
                searchQuery={searchQuery}
                totalCount={tasks.length}
              />
            </>
          )}
        </>
      )}
    </main>
  )
}

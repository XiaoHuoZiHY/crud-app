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

  const pendingCount = tasks.length - completedCount

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
      <header className="tasks-page__header">
        <h1>任务管理</h1>
        <p className="tasks-page__subtitle">创建、编辑、搜索并追踪你的待办事项</p>
        {!loading && !error && (
          <div className="tasks-page__stats">
            <span className="tasks-page__stat">
              全部 <strong>{tasks.length}</strong>
            </span>
            <span className="tasks-page__stat tasks-page__stat--accent">
              待完成 <strong>{pendingCount}</strong>
            </span>
            <span className="tasks-page__stat tasks-page__stat--success">
              已完成 <strong>{completedCount}</strong>
            </span>
          </div>
        )}
      </header>

      {loading && <Loading text="Loading..." />}
      {!loading && (
        <>
          {error && <p className="tasks-page__error">错误：{error}</p>}
          <section className="panel">
            <TaskForm />
          </section>
          {!error && (
            <>
              <section className="panel">
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
              </section>
              <section className="panel">
                <TaskList
                  tasks={filteredTasks}
                  searchQuery={searchQuery}
                  totalCount={tasks.length}
                />
              </section>
            </>
          )}
        </>
      )}
    </main>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTasks } from '../hooks/useTasks'
import { taskTitleSchema } from '../utils/taskValidation'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function TaskItem({ task }) {
  const { updateTask, deleteTask } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskTitleSchema),
    defaultValues: { title: task.title },
  })

  useEffect(() => {
    if (!isEditing) {
      reset({ title: task.title })
    }
  }, [task.title, isEditing, reset])

  const handleToggle = async () => {
    const nextCompleted = !task.completed

    try {
      await updateTask(task.id, { completed: nextCompleted })
      toast.success(nextCompleted ? '已标记为完成' : '已标记为未完成')
    } catch {
      toast.error('更新任务状态失败')
    }
  }

  const startEditing = () => {
    reset({ title: task.title })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    reset({ title: task.title })
    setIsEditing(false)
  }

  const onSaveTitle = async ({ title }) => {
    if (title === task.title) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)

    try {
      await updateTask(task.id, { title })
      toast.success('任务更新成功')
      setIsEditing(false)
    } catch {
      toast.error('更新任务失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditKeyDown = (event) => {
    if (event.key === 'Escape') {
      cancelEditing()
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`确定删除任务「${task.title}」吗？`)
    if (!confirmed) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteTask(task.id)
      toast.success('任务删除成功')
    } catch {
      toast.error('删除任务失败')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li
      className={`task-item${task.completed ? ' task-item--completed' : ''}`}
    >
      <label className="task-item__status">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          aria-label={task.completed ? '标记为未完成' : '标记为完成'}
        />
        <span className="task-item__badge">
          {task.completed ? '已完成' : '未完成'}
        </span>
      </label>

      <div className="task-item__content">
        {isEditing ? (
          <form
            className="task-item__edit-form"
            onSubmit={handleSubmit(onSaveTitle)}
            noValidate
          >
            <input
              type="text"
              className={`task-item__edit-input${errors.title ? ' task-item__edit-input--error' : ''}`}
              autoFocus
              disabled={isSaving}
              onKeyDown={handleEditKeyDown}
              {...register('title')}
            />
            {errors.title && (
              <p className="task-item__error" role="alert">
                {errors.title.message}
              </p>
            )}
            <div className="task-item__edit-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                className="task-item__cancel"
                onClick={cancelEditing}
                disabled={isSaving}
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="task-item__view">
            <h3 className="task-item__title">{task.title}</h3>
            <div className="task-item__actions">
              <button
                type="button"
                className="task-item__edit-btn"
                onClick={startEditing}
                disabled={isDeleting}
              >
                编辑
              </button>
              <button
                type="button"
                className="task-item__delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? '删除中...' : '删除'}
              </button>
            </div>
          </div>
        )}

        <time className="task-item__date" dateTime={task.createdAt}>
          创建于 {formatDate(task.createdAt)}
        </time>
      </div>
    </li>
  )
}

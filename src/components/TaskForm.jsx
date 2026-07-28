import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTasks } from '../hooks/useTasks'
import { taskTitleSchema } from '../utils/taskValidation'

export default function TaskForm() {
  const { addTask } = useTasks()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskTitleSchema),
    defaultValues: { title: '' },
  })

  const onSubmit = async ({ title }) => {
    try {
      await addTask(title)
      toast.success('任务创建成功')
      reset()
    } catch {
      toast.error('创建任务失败')
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          新任务
        </label>
        <div className="task-form__input-row">
          <input
            id="task-title"
            type="text"
            className={`task-form__input${errors.title ? ' task-form__input--error' : ''}`}
            placeholder="输入任务标题"
            disabled={isSubmitting}
            {...register('title')}
          />
          <button
            type="submit"
            className="task-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '添加中...' : '添加'}
          </button>
        </div>
        {errors.title && (
          <p className="task-form__error" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>
    </form>
  )
}

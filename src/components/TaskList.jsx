import TaskItem from './TaskItem'

export default function TaskList({ tasks, searchQuery, totalCount }) {
  if (totalCount === 0) {
    return <p className="task-list__empty">No tasks yet. Add one above.</p>
  }

  if (tasks.length === 0 && searchQuery.trim()) {
    return (
      <p className="task-list__empty">No tasks match your search.</p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

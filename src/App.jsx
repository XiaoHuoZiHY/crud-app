import TasksPage from './pages/TasksPage'
import ErrorFallback from './components/ErrorFallback'
import { ErrorBoundary } from 'react-error-boundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <TasksPage />
    </ErrorBoundary>
  )
}

export default App

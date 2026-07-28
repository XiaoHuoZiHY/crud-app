import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { TaskProvider } from './context/TaskProvider'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TaskProvider>
      <App />
      <ToastContainer position="top-right" autoClose={2500} />
    </TaskProvider>
  </StrictMode>,
)

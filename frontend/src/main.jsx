import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './theme/ThemeContext'
import { AuthProvider } from './auth/AuthContext'
import { ToastProvider } from './components/ToastContext'
import MaterialLoader from './components/MaterialLoader'
import LoadingClassToggler from './components/LoadingClassToggler'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
          <MaterialLoader />
          <LoadingClassToggler />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

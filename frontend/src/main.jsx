import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CombinedProvider from './providers/AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CombinedProvider>
      <App />
    </CombinedProvider>
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BuildingProvider } from './ContextProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BuildingProvider>
      <App />
    </BuildingProvider> 
  </React.StrictMode>,
)

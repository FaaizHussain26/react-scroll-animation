import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Export function to mount the component
export function mountScrollComponent(elementId: string, props = {}) {
  const container = document.getElementById(elementId)
  if (!container) {
    console.error('Container not found:', elementId)
    return
  }
  
  const root = createRoot(container)
  root.render(<App {...props} />)
}

// Make it available globally for IIFE builds
if (typeof window !== 'undefined') {
  (window as unknown as { mountScrollComponent: typeof mountScrollComponent }).mountScrollComponent = mountScrollComponent
}

// Auto-mount for development
if (import.meta.env.DEV) {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    createRoot(rootElement).render(<App />)
  }
}
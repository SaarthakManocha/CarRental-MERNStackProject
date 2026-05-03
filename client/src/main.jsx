import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import './styles/reactbits-parity.css'
import './styles/landing.css'
import './styles/stepper.css'
import './styles/starborder.css'
import './styles/glarehover.css'
import './styles/counter.css'
import './styles/flowingmenu.css'
import './styles/vehicledetail.css'
import './styles/brandfleet.css'
import App from './App.jsx'
import ErrorBoundary from './components/feedback/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

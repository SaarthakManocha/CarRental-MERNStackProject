import { Component } from 'react'
import GlitchText from '../animations/GlitchText'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Runtime error captured by boundary:', error)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="runtime-error-shell">
          <section className="runtime-error-card">
            <h1>
              <GlitchText text="Runtime Error" />
            </h1>
            <p>Something unexpected happened while rendering this view.</p>
            <button type="button" className="btn solid" onClick={this.handleReload}>
              Reload App
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

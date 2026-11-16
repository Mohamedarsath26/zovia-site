import { VERSION } from '../version.js'

export default function Hero() {
  return (
    <header className="hero">
      <nav className="nav">
        <span className="logo">zovia</span>
        <span className="badge">v{VERSION}</span>
      </nav>

      <div className="hero-body">
        <h1>
          Shipped from a laptop<br />
          in <span className="accent">Chennai</span>.
        </h1>
        <p>
          This page is a React app in a Docker container on a Windows machine
          at home. You reached it over a tunnel. No server was rented.
        </p>
        <div className="cta">
          <a className="btn" href="#how">How it works</a>
          <a className="btn ghost" href="https://github.com/Mohamedarsath26">GitHub</a>
        </div>
      </div>
    </header>
  )
}

import { VERSION } from '../version.js'

export default function Footer() {
  return (
    <footer className="footer">
      <p>zovia.in</p>
      <p className="muted">
        React + Docker + Cloudflare Tunnel &middot; version {VERSION}
      </p>
    </footer>
  )
}

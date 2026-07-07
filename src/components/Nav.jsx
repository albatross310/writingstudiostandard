import { NavLink } from 'react-router-dom'
import './Nav.css'

const links = [
  { to: '/standard',      label: 'What It Is'    },
  { to: '/architecture',  label: 'Architecture'  },
  { to: '/examples',      label: 'Examples'      },
  { to: '/faq',           label: 'FAQ'           },
  { to: '/contact',       label: 'Contact'       },
]

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner container">
        <NavLink to="/" className="nav__wordmark">
          Writing Studio Standard
        </NavLink>
        <nav className="nav__links" aria-label="Primary">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                'nav__link' + (isActive ? ' nav__link--active' : '')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

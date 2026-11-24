
import { NavLink } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: '▦' },
  { name: 'Sentiment Analysis', path: '/sentiment', icon: '◈' },
  { name: 'Image Analysis', path: '/image', icon: '▧' },
  { name: 'Analysis History', path: '/history', icon: '◷' },
];

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        Sentiment<span>AI</span>
      </div>

      <div className="nav-heading">WORKSPACE</div>

      <nav className="nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        AI Sentiment Platform
        <br />
        Version 1.0
      </div>
    </aside>
  );
}

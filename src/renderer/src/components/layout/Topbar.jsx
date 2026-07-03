import { NavLink } from 'react-router-dom'
import { Award } from 'lucide-react'

function Topbar() {
  return (
    <header className="h-16 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between px-8 shadow-sm">
      {/* Left: Branding & Info */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Award size={20} />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">Media Scoring System</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Dinas Kominfo Kota Kendari
          </p>
        </div>
      </div>

      {/* Right: Navigation Links */}
      <nav className="flex items-center gap-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-semibold rounded-lg transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </header>
  )
}

export default Topbar

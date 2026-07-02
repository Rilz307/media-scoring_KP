import { NavLink } from 'react-router-dom'

const menus = [
  {
    name: 'Dashboard',
    path: '/'
  },
  {
    name: 'Tambah Media',
    path: '/media/new'
  },
  {
    name: 'Rekapitulasi',
    path: '/rekap'
  }
]

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-xl font-bold">
          Media Scoring
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Kominfo Kota Kendari
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? 'bg-blue-600'
                  : 'hover:bg-slate-800'
              }`
            }
          >
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
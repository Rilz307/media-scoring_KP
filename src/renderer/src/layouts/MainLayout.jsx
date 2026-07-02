import { Outlet } from 'react-router-dom'
import Topbar from '../components/layout/Topbar'

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Topbar />

      <main className="flex-1 overflow-auto p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout

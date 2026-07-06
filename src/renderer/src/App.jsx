import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import ConnectionGuard from './components/layout/ConnectionGuard'

import DashboardPage from './pages/DashboardPage'
import MediaFormPage from './pages/MediaFormPage'
import MediaDetailPage from './pages/MediaDetailPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<ConnectionGuard />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/media/new" element={<MediaFormPage />} />

            <Route path="/media/:id/edit" element={<MediaFormPage />} />

            <Route path="/media/:id" element={<MediaDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App

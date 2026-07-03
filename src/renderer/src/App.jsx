import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'

import DashboardPage from './pages/DashboardPage'
import MediaFormPage from './pages/MediaFormPage'
import MediaDetailPage from './pages/MediaDetailPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="/media/new" element={<MediaFormPage />} />

          <Route path="/media/:id/edit" element={<MediaFormPage />} />

          <Route path="/media/:id" element={<MediaDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

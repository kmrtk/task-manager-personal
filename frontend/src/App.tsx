import { Routes, Route } from 'react-router-dom'
import { FolderListPage } from './pages/FolderListPage'
import { BoardPage } from './pages/BoardPage'
import { TrashPage } from './pages/TrashPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FolderListPage />} />
      <Route path="/folders/:folderId" element={<BoardPage />} />
      <Route path="/trash" element={<TrashPage />} />
    </Routes>
  )
}

import { Routes, Route } from 'react-router-dom'
import { FolderListPage } from './pages/FolderListPage'
import { BoardPage } from './pages/BoardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FolderListPage />} />
      <Route path="/folders/:folderId" element={<BoardPage />} />
    </Routes>
  )
}

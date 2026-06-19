import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFolders, createFolder } from '../api/folder'
import type { Folder } from '../api/folder'

export function FolderListPage() {
  const navigate = useNavigate()
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFolders()
      .then(setFolders)
      .catch(() => setError('フォルダの取得に失敗しました。'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const folder = await createFolder(newName.trim())
      setFolders((prev) => [...prev, folder])
      setNewName('')
      setCreating(false)
    } catch {
      setError('フォルダの作成に失敗しました。')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') {
      setCreating(false)
      setNewName('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0079bf]">
      <header className="bg-[#026aa7] px-4 py-3 flex items-center shadow">
        <h1 className="text-white font-bold text-lg">タスク管理</h1>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-base">フォルダ一覧</h2>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              + フォルダを作成
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-white/80 text-sm animate-pulse">読み込み中...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => navigate(`/folders/${folder.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📁</span>
                  <div>
                    <p className="font-semibold text-gray-800">{folder.name}</p>
                    {folder.createdAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {folder.createdAt.split('T')[0]}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {creating && (
              <div className="bg-white rounded-lg shadow-sm border border-blue-400 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📁</span>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="フォルダ名を入力..."
                    autoFocus
                    className="flex-1 text-sm font-semibold text-gray-800 outline-none border-b border-gray-300 focus:border-blue-500 pb-0.5"
                  />
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <button
                    onClick={() => { setCreating(false); setNewName('') }}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim() || saving}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                  >
                    {saving ? '作成中...' : '作成'}
                  </button>
                </div>
              </div>
            )}

            {folders.length === 0 && !creating && (
              <div className="col-span-2 text-center text-white/60 py-12 text-sm">
                フォルダがありません。「フォルダを作成」から始めましょう。
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

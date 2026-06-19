import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFolders, createFolder, updateFolder, deleteFolder } from '../api/folder'
import type { Folder } from '../api/folder'

export function FolderListPage() {
  const navigate = useNavigate()
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchFolders()
      .then(setFolders)
      .catch(() => setError('フォルダの取得に失敗しました。'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const startEdit = (folder: Folder) => {
    setMenuOpenId(null)
    setEditingId(folder.id)
    setEditName(folder.name)
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return
    try {
      const updated = await updateFolder(id, editName.trim())
      setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)))
      setEditingId(null)
    } catch {
      setError('フォルダ名の変更に失敗しました。')
    }
  }

  const handleEditKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') handleUpdate(id)
    if (e.key === 'Escape') setEditingId(null)
  }

  const handleDelete = async () => {
    if (deletingId === null) return
    setDeleting(true)
    try {
      await deleteFolder(deletingId)
      setFolders((prev) => prev.filter((f) => f.id !== deletingId))
      setDeletingId(null)
    } catch {
      setError('フォルダの削除に失敗しました。')
    } finally {
      setDeleting(false)
    }
  }

  const deletingFolder = folders.find((f) => f.id === deletingId)

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
            {folders.map((folder) =>
              editingId === folder.id ? (
                <div
                  key={folder.id}
                  className="bg-white rounded-lg shadow-sm border border-blue-400 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📁</span>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, folder.id)}
                      autoFocus
                      className="flex-1 text-sm font-semibold text-gray-800 outline-none border-b border-gray-300 focus:border-blue-500 pb-0.5"
                    />
                  </div>
                  <div className="flex gap-2 mt-3 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleUpdate(folder.id)}
                      disabled={!editName.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <div key={folder.id} className="relative group">
                  <button
                    onClick={() => navigate(`/folders/${folder.id}`)}
                    className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3 pr-6">
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

                  {/* メニューボタン */}
                  <div className="absolute top-3 right-3" ref={menuOpenId === folder.id ? menuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpenId(menuOpenId === folder.id ? null : folder.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-all text-sm leading-none"
                      title="操作メニュー"
                    >
                      ︙
                    </button>

                    {menuOpenId === folder.id && (
                      <div className="absolute right-0 top-7 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEdit(folder)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          名前を変更
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpenId(null)
                            setDeletingId(folder.id)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          削除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

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

      {/* 削除確認ダイアログ */}
      {deletingId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 mx-4">
            <h3 className="font-bold text-gray-800 text-base mb-2">フォルダを削除しますか？</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">「{deletingFolder?.name}」</span> を削除します。
            </p>
            <p className="text-sm text-red-600 mb-5">
              このフォルダ内のタスクもすべて削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                disabled={deleting}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

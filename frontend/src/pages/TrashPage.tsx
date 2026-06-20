import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchDeletedTasks,
  fetchDeletedFolders,
  restoreTask,
  restoreFolder,
  permanentDeleteTask,
  permanentDeleteFolder,
} from '../api/trash'
import type { Task } from '../types/task'
import type { Folder } from '../api/folder'
import { STATUS_LABEL } from '../types/task'

type ConfirmTarget =
  | { kind: 'task'; item: Task }
  | { kind: 'folder'; item: Folder }

export function TrashPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null)
  const [processing, setProcessing] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([fetchDeletedTasks(), fetchDeletedFolders()])
      .then(([t, f]) => {
        setTasks(t)
        setFolders(f)
      })
      .catch(() => setError('ゴミ箱の取得に失敗しました。'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleRestore = async (target: ConfirmTarget) => {
    setProcessing(true)
    try {
      if (target.kind === 'task') {
        await restoreTask(target.item.id)
        setTasks((prev) => prev.filter((t) => t.id !== target.item.id))
      } else {
        await restoreFolder(target.item.id)
        setFolders((prev) => prev.filter((f) => f.id !== target.item.id))
        setTasks((prev) => prev.filter((t) => t.folderId !== target.item.id))
      }
    } catch {
      setError('復元に失敗しました。')
    } finally {
      setProcessing(false)
    }
  }

  const handlePermanentDelete = async () => {
    if (!confirmTarget) return
    setProcessing(true)
    try {
      if (confirmTarget.kind === 'task') {
        await permanentDeleteTask(confirmTarget.item.id)
        setTasks((prev) => prev.filter((t) => t.id !== confirmTarget.item.id))
      } else {
        await permanentDeleteFolder(confirmTarget.item.id)
        setFolders((prev) => prev.filter((f) => f.id !== confirmTarget.item.id))
        setTasks((prev) => prev.filter((t) => t.folderId !== confirmTarget.item.id))
      }
      setConfirmTarget(null)
    } catch {
      setError('完全削除に失敗しました。')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0079bf]">
      <header className="bg-[#026aa7] px-4 py-3 flex items-center gap-3 shadow">
        <button
          onClick={() => navigate('/')}
          className="text-white/80 hover:text-white text-sm"
        >
          ← 戻る
        </button>
        <h1 className="text-white font-bold text-lg">ゴミ箱</h1>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
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
          <>
            {/* 削除されたフォルダ */}
            <section className="mb-8">
              <h2 className="text-white font-semibold text-base mb-3">削除されたフォルダ</h2>
              {folders.length === 0 ? (
                <p className="text-white/60 text-sm">削除されたフォルダはありません。</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">📁</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{folder.name}</p>
                          {folder.createdAt && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              作成: {folder.createdAt.split('T')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleRestore({ kind: 'folder', item: folder })}
                          disabled={processing}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          復元
                        </button>
                        <button
                          onClick={() => setConfirmTarget({ kind: 'folder', item: folder })}
                          disabled={processing}
                          className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          完全削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 削除されたタスク */}
            <section>
              <h2 className="text-white font-semibold text-base mb-3">削除されたタスク</h2>
              {tasks.length === 0 ? (
                <p className="text-white/60 text-sm">削除されたタスクはありません。</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {STATUS_LABEL[task.status]}
                          {task.dueDate && ` · 期限: ${task.dueDate}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleRestore({ kind: 'task', item: task })}
                          disabled={processing}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          復元
                        </button>
                        <button
                          onClick={() => setConfirmTarget({ kind: 'task', item: task })}
                          disabled={processing}
                          className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          完全削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* 完全削除確認ダイアログ */}
      {confirmTarget !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 mx-4">
            <h3 className="font-bold text-gray-800 text-base mb-2">完全に削除しますか？</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">
                「{confirmTarget.kind === 'task' ? confirmTarget.item.title : confirmTarget.item.name}」
              </span>{' '}
              を完全に削除します。
            </p>
            <p className="text-sm text-red-600 mb-5">
              {confirmTarget.kind === 'folder'
                ? 'このフォルダ内のタスクもすべて完全削除されます。'
                : ''}
              この操作は取り消せません。
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmTarget(null)}
                disabled={processing}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5"
              >
                キャンセル
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={processing}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {processing ? '削除中...' : '完全削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

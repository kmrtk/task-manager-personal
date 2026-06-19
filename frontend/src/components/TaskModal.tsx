import { useState } from 'react'
import type { Task, TaskStatus } from '../types/task'
import { STATUSES, STATUS_LABEL } from '../types/task'
import { createTask, updateTask } from '../api/task'

interface Props {
  initialTask?: Task
  defaultStatus?: TaskStatus
  folderId: number | null
  onClose: () => void
  onSave: (task: Task) => void
}

export function TaskModal({ initialTask, defaultStatus = 'TODO', folderId, onClose, onSave }: Props) {
  const isEdit = initialTask !== undefined
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? defaultStatus)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError(null)
    try {
      let saved: Task
      if (isEdit) {
        saved = await updateTask(initialTask.id, {
          title: title.trim(),
          description: description.trim() || null,
          status,
          folderId,
        })
      } else {
        saved = await createTask({
          title: title.trim(),
          description: description.trim() || null,
          status,
          folderId,
        })
      }
      onSave(saved)
    } catch {
      setError('保存に失敗しました。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          {isEdit ? 'タスクを編集' : 'タスクを追加'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">タイトル *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトル"
              autoFocus
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">説明（任意）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの詳細説明"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ステータス</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              {saving ? '保存中...' : (isEdit ? '更新' : '追加')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

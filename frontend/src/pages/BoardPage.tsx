import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { Task, TaskStatus } from '../types/task'
import { STATUSES } from '../types/task'
import { BoardColumn } from '../components/BoardColumn'
import { SearchBar } from '../components/SearchBar'

type TaskMap = Record<TaskStatus, Task[]>

function groupByStatus(tasks: Task[]): TaskMap {
  return {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  }
}

export function BoardPage() {
  const { folderId } = useParams<{ folderId: string }>()
  const navigate = useNavigate()
  const [taskMap, setTaskMap] = useState<TaskMap>({ TODO: [], IN_PROGRESS: [], DONE: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchTasks = useCallback(async (query = '') => {
    setLoading(true)
    setError(null)
    try {
      const url = query ? `/api/tasks/search?q=${encodeURIComponent(query)}` : '/api/tasks'
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Task[] = await res.json()
      const filtered = folderId
        ? data.filter((t) => t.folderId === Number(folderId))
        : data
      setTaskMap(groupByStatus(filtered))
    } catch {
      setError('タスクの取得に失敗しました。バックエンドが起動しているか確認してください。')
    } finally {
      setLoading(false)
    }
  }, [folderId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleSearch = (query: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => fetchTasks(query), 300)
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const findContainer = (id: number | string): TaskStatus | null => {
    for (const status of STATUSES) {
      if (status === id) return status
      if (taskMap[status].some((t) => t.id === id)) return status
    }
    return null
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const fromStatus = findContainer(active.id)
    const toStatus = findContainer(over.id)
    if (!fromStatus || !toStatus || fromStatus === toStatus) return

    setTaskMap((prev) => {
      const task = prev[fromStatus].find((t) => t.id === active.id)
      if (!task) return prev
      const updatedTask = { ...task, status: toStatus }
      return {
        ...prev,
        [fromStatus]: prev[fromStatus].filter((t) => t.id !== active.id),
        [toStatus]: [...prev[toStatus], updatedTask],
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const fromStatus = findContainer(active.id)
    const toStatus = findContainer(over.id)
    if (!fromStatus || !toStatus || fromStatus !== toStatus) return

    setTaskMap((prev) => {
      const items = prev[fromStatus]
      const oldIdx = items.findIndex((t) => t.id === active.id)
      const newIdx = items.findIndex((t) => t.id === over.id)
      if (oldIdx === newIdx) return prev
      return { ...prev, [fromStatus]: arrayMove(items, oldIdx, newIdx) }
    })
  }

  const totalCount = STATUSES.reduce((acc, s) => acc + taskMap[s].length, 0)

  return (
    <div className="min-h-screen bg-[#0079bf]">
      <header className="bg-[#026aa7] px-4 py-3 flex items-center gap-4 shadow">
        <button
          onClick={() => navigate('/')}
          className="text-white/80 hover:text-white text-sm font-medium"
        >
          ← フォルダ一覧
        </button>
        <h1 className="text-white font-bold text-lg">タスクボード</h1>
        <div className="flex-1" />
        <SearchBar onSearch={handleSearch} />
        <span className="text-white/70 text-sm">{totalCount} 件</span>
      </header>

      <main className="p-4">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <span className="text-white/80 text-sm animate-pulse">読み込み中...</span>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((status) => (
                <BoardColumn key={status} status={status} tasks={taskMap[status]} />
              ))}
            </div>
          </DndContext>
        )}
      </main>
    </div>
  )
}

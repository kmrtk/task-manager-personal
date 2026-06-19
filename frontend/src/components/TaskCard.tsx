import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types/task'
import { STATUS_LABEL, PRIORITY_LABEL, PRIORITY_DOT_COLOR } from '../types/task'

const STATUS_COLOR: Record<string, string> = {
  TODO: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}

function getDueDateStyle(dueDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'text-red-600 font-semibold'
  if (diffDays <= 3) return 'text-yellow-600 font-semibold'
  return 'text-gray-400'
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`「${task.title}」を削除しますか？`)) {
      onDelete(task.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {task.priority && (
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${PRIORITY_DOT_COLOR[task.priority]}`}
                title={`優先度: ${PRIORITY_LABEL[task.priority]}`}
              />
            )}
            <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-2 flex items-center justify-between flex-wrap gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[task.status]}`}>
              {STATUS_LABEL[task.status]}
            </span>
            {task.dueDate && (
              <span className={`text-xs ${getDueDateStyle(task.dueDate)}`}>
                📅 {task.dueDate}
              </span>
            )}
          </div>
        </div>

        {/* 編集・削除ボタン（ホバー時のみ表示） */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-blue-500 text-xs p-1 rounded hover:bg-gray-100"
            title="編集"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 text-xs p-1 rounded hover:bg-gray-100"
            title="削除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

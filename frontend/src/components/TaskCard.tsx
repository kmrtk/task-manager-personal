import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types/task'
import { STATUS_LABEL } from '../types/task'

const STATUS_COLOR: Record<string, string> = {
  TODO: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}

interface Props {
  task: Task
}

export function TaskCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[task.status]}`}>
          {STATUS_LABEL[task.status]}
        </span>
        {task.createdAt && (
          <span className="text-xs text-gray-400">{task.createdAt.split('T')[0]}</span>
        )}
      </div>
    </div>
  )
}

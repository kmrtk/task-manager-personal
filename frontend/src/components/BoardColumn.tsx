import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, TaskStatus, SortOrder } from '../types/task'
import { STATUS_LABEL } from '../types/task'
import { TaskCard } from './TaskCard'

const COLUMN_COLOR: Record<TaskStatus, string> = {
  TODO: 'border-t-gray-400',
  IN_PROGRESS: 'border-t-blue-500',
  DONE: 'border-t-green-500',
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  sortOrder: SortOrder
  onSortChange: (order: SortOrder) => void
  onAddTask: (status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: number) => void
  onStatusChange: (id: number, newStatus: TaskStatus) => void
}

export function BoardColumn({ status, tasks, sortOrder, onSortChange, onAddTask, onEditTask, onDeleteTask, onStatusChange }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className={`flex flex-col w-72 shrink-0 bg-gray-100 rounded-lg border-t-4 ${COLUMN_COLOR[status]}`}>
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">{STATUS_LABEL[status]}</h2>
        <div className="flex items-center gap-1">
          <span className="text-xs bg-gray-300 text-gray-600 rounded-full px-2 py-0.5 font-medium">
            {tasks.length}
          </span>
          <button
            onClick={() =>
              onSortChange(sortOrder === 'date_asc' ? 'date_desc' : 'date_asc')
            }
            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
              sortOrder === 'date_asc' || sortOrder === 'date_desc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            日付{sortOrder === 'date_asc' ? '↑' : sortOrder === 'date_desc' ? '↓' : ''}
          </button>
          <button
            onClick={() =>
              onSortChange(sortOrder === 'priority_asc' ? 'priority_desc' : 'priority_asc')
            }
            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
              sortOrder === 'priority_asc' || sortOrder === 'priority_desc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            優先度{sortOrder === 'priority_asc' ? '↑' : sortOrder === 'priority_desc' ? '↓' : ''}
          </button>
        </div>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 px-2 pb-3 min-h-24 rounded-b-lg transition-colors ${
            isOver ? 'bg-blue-50' : ''
          }`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))}
          <button
            onClick={() => onAddTask(status)}
            className="mt-1 w-full text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg py-2 transition-colors"
          >
            + タスク追加
          </button>
        </div>
      </SortableContext>
    </div>
  )
}

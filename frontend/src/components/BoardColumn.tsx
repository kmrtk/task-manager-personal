import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, TaskStatus } from '../types/task'
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
}

export function BoardColumn({ status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className={`flex flex-col w-72 shrink-0 bg-gray-100 rounded-lg border-t-4 ${COLUMN_COLOR[status]}`}>
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">{STATUS_LABEL[status]}</h2>
        <span className="text-xs bg-gray-300 text-gray-600 rounded-full px-2 py-0.5 font-medium">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 px-2 pb-3 min-h-24 rounded-b-lg transition-colors ${
            isOver ? 'bg-blue-50' : ''
          }`}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  folderId: number | null
  priority: TaskPriority | null
  dueDate: string | null
  tags: string[]
  createdAt: string | null
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: '未着手',
  IN_PROGRESS: '進行中',
  DONE: '完了',
}

export const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
}

export const PRIORITIES: TaskPriority[] = ['HIGH', 'MEDIUM', 'LOW']

export const PRIORITY_DOT_COLOR: Record<TaskPriority, string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-400',
  LOW: 'bg-green-500',
}

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

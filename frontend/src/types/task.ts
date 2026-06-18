export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  folderId: number | null
  createdAt: string | null
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: '未着手',
  IN_PROGRESS: '進行中',
  DONE: '完了',
}

export const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

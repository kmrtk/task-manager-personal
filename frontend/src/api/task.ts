import type { Task, TaskStatus, TaskPriority } from '../types/task'

export async function fetchTasks(query = ''): Promise<Task[]> {
  const url = query ? `/api/tasks/search?q=${encodeURIComponent(query)}` : '/api/tasks'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createTask(data: {
  title: string
  description: string | null
  status: TaskStatus
  folderId: number | null
  priority: TaskPriority | null
  dueDate: string | null
  tags: string[]
}): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

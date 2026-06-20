import type { Task } from '../types/task'
import type { Folder } from './folder'

export async function fetchDeletedTasks(): Promise<Task[]> {
  const res = await fetch('/api/trash/tasks')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchDeletedFolders(): Promise<Folder[]> {
  const res = await fetch('/api/trash/folders')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function restoreTask(id: number): Promise<Task> {
  const res = await fetch(`/api/trash/tasks/${id}/restore`, { method: 'POST' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function restoreFolder(id: number): Promise<Folder> {
  const res = await fetch(`/api/trash/folders/${id}/restore`, { method: 'POST' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function permanentDeleteTask(id: number): Promise<void> {
  const res = await fetch(`/api/trash/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function permanentDeleteFolder(id: number): Promise<void> {
  const res = await fetch(`/api/trash/folders/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

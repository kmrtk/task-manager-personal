export interface Folder {
  id: number
  name: string
  createdAt: string | null
}

export async function fetchFolders(): Promise<Folder[]> {
  const res = await fetch('/api/folders')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createFolder(name: string): Promise<Folder> {
  const res = await fetch('/api/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

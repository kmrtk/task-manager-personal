import { useState } from 'react'

interface Props {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="タスクを検索..."
        className="w-64 pl-9 pr-8 py-2 text-sm bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:bg-white/30"
      />
      <span className="absolute left-2.5 top-2.5 text-white/70 text-sm">🔍</span>
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-2 text-white/70 hover:text-white text-sm leading-none"
        >
          ✕
        </button>
      )}
    </div>
  )
}

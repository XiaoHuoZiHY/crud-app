export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="task-search">
        搜索
      </label>
      <input
        id="task-search"
        type="search"
        className="search-bar__input"
        placeholder="按标题搜索..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

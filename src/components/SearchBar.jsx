function SearchBar({ value, onChange, resultCount }) {
  return (
    <>
      <input
        type="text"
        className="search-bar"
        placeholder="Search projects, tools, and resources..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      {value && (
        <div className="search-results">
          Found {resultCount} {resultCount === 1 ? 'project' : 'projects'}
        </div>
      )}
    </>
  )
}

export default SearchBar

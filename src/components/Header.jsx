function Header({ onReset }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title-wrapper" onClick={onReset} title="Clear all filters and search">
          <h1>🔗 SLAG</h1>
          <p className="header-subtitle">Searchable Link Aggregator</p>
        </div>
      </div>
    </header>
  )
}

export default Header
